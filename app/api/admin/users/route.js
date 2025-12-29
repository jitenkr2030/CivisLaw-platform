// Admin Users API Route
// Handles user management: GET list, PUT update, DELETE (admin only)

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { checkRateLimit, maskEmail } from '@/lib/auth';
import { hashIp } from '@/lib/auth-server';

const prisma = new PrismaClient();

// GET - List all users (admin only)
export async function GET(request) {
  try {
    // Authenticate
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'ADMIN_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.', code: 'ADMIN_403' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimit = checkRateLimit('admin_users_list', 60, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests', code: 'ADMIN_429' },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), 100);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where = {
      ...(role && { role: role.toUpperCase() }),
      ...(status === 'active' && { status: 'ACTIVE' }),
      ...(status === 'inactive' && { status: { not: 'ACTIVE' } }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
        ],
      }),
    };

    // Fetch users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          role: true,
          status: true,
          isVerified: true,
          language: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              documents: true,
              statements: true,
              auditLogs: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Mask sensitive fields
    const maskedUsers = users.map(user => ({
      ...user,
      email: maskEmail(user.email),
      phoneNumber: user.phoneNumber
        ? `***${user.phoneNumber.slice(-4)}`
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: maskedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });

  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}

// PATCH - Bulk user operations (admin only)
export async function PATCH(request) {
  try {
    // Authenticate
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'ADMIN_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.', code: 'ADMIN_403' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userIds, action, role, reason } = body;

    // Validate action
    const validActions = ['activate', 'deactivate', 'change_role', 'verify'];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Validate user IDs
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User IDs are required', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimit = checkRateLimit('admin_users_bulk', 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many bulk operations', code: 'ADMIN_429' },
        { status: 429 }
      );
    }

    // Build update data
    let updateData = {};
    let logAction = '';

    switch (action) {
      case 'activate':
        updateData = { status: 'ACTIVE' };
        logAction = 'ADMIN_USER_ACTIVATE';
        break;
      case 'deactivate':
        updateData = { status: 'INACTIVE' };
        logAction = 'ADMIN_USER_DEACTIVATE';
        break;
      case 'change_role':
        const validRoles = ['CITIZEN', 'VICTIM', 'NGO', 'LEGAL_AID', 'ADMIN'];
        if (!role || !validRoles.includes(role)) {
          return NextResponse.json(
            { success: false, error: 'Invalid role', code: 'ADMIN_400' },
            { status: 400 }
          );
        }
        updateData = { role };
        logAction = 'ADMIN_ROLE_CHANGE';
        break;
      case 'verify':
        updateData = { isVerified: true };
        logAction = 'ADMIN_USER_VERIFY';
        break;
    }

    // Perform update
    const updated = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: logAction,
        category: 'ADMIN',
        severity: 'INFO',
        metadata: JSON.stringify({
          affectedUsers: userIds.length,
          action,
          role: role || null,
          reason: reason || 'Admin action',
          timestamp: new Date().toISOString(),
        }),
        ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully ${action === 'change_role' ? `changed role to ${role}` : action}ed ${updated.count} user(s)`,
      data: { updatedCount: updated.count }
    });

  } catch (error) {
    console.error('Admin users update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update users', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request) {
  try {
    // Authenticate
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'ADMIN_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.', code: 'ADMIN_403' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (userId === payload.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'ADMIN_404' },
        { status: 404 }
      );
    }

    // Delete user and related records (cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'ADMIN_USER_DELETE',
        category: 'ADMIN',
        resource: 'user',
        resourceId: userId,
        metadata: JSON.stringify({
          deletedUserEmail: maskEmail(user.email),
          deletedUserName: user.fullName,
          timestamp: new Date().toISOString()
        }),
        severity: 'WARN'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}
