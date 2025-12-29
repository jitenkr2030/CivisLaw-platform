// Admin User Management API - Manage user accounts
// Meta-data only, no access to sensitive content

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit, hashIp, maskEmail } from '../../../lib/auth.js';

const prisma = new PrismaClient();

// ============================================
// GET /api/admin/users - List users with pagination and filtering
// ============================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), 100);
    const skip = (page - 1) * limit;

    // Filters
    const role = searchParams.get('role');
    const status = searchParams.get('status'); // active, inactive
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause (meta-data only)
    const where = {
      ...(role && { role: role.toUpperCase() }),
      ...(status === 'active' && { isActive: true }),
      ...(status === 'inactive' && { isActive: false }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Rate limiting
    const rateLimit = checkRateLimit('admin_users_list', 60, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Fetch users (meta-data only, no sensitive content)
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true, // Will be masked in response
          fullName: true,
          phoneNumber: true, // Will be masked
          role: true,
          isActive: true,
          isVerified: true,
          language: true,
          lastLoginAt: true,
          createdAt: true,
          ngoProfile: {
            select: {
              organizationName: true,
              region: true,
              isVerified: true,
            },
          },
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
      // No access to documents, statements, or their content
    }));

    return NextResponse.json({
      users: maskedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/admin/users - Bulk user operations
// ============================================
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { userIds, action, role, reason } = body;

    // Validate action
    const validActions = ['activate', 'deactivate', 'change_role', 'verify'];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Validate user IDs
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs are required' },
        { status: 400 }
      );
    }

    // Validate role if changing
    if (action === 'change_role') {
      const validRoles = ['CITIZEN', 'VICTIM', 'NGO', 'LEGAL_AID', 'ADMIN'];
      if (!role || !validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
    }

    // Rate limiting
    const rateLimit = checkRateLimit('admin_users_bulk', 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many bulk operations' },
        { status: 429 }
      );
    }

    // Build update data
    let updateData = {};
    let logAction = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        logAction = 'ADMIN_USER_UPDATE';
        break;
      case 'deactivate':
        updateData = { isActive: false };
        logAction = 'ADMIN_USER_UPDATE';
        break;
      case 'change_role':
        updateData = { role };
        logAction = 'ADMIN_ROLE_CHANGE';
        break;
      case 'verify':
        updateData = { isVerified: true };
        logAction = 'ADMIN_USER_UPDATE';
        break;
    }

    // Perform update
    const updated = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    });

    // Create audit log (anonymized)
    await prisma.auditLog.create({
      data: {
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
      message: `Successfully ${action === 'change_role' ? `changed role to ${role}` : action}ed ${updated.count} user(s)`,
      updatedCount: updated.count,
    });
  } catch (error) {
    console.error('Admin users update error:', error);
    return NextResponse.json(
      { error: 'Failed to update users' },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/admin/users/[userId] - Get user details (meta-data only)
// ============================================
export async function GET_USER(request, { params }) {
  try {
    const { userId } = params;

    // Rate limiting
    const rateLimit = checkRateLimit(`admin_user_${userId}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Fetch user meta-data only
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true, // Will be masked
        phoneNumber: true, // Will be masked
        fullName: true,
        role: true,
        isActive: true,
        isVerified: true,
        language: true,
        timezone: true,
        mfaEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        ngoProfile: {
          select: {
            organizationName: true,
            region: true,
            isVerified: true,
            createdAt: true,
          },
        },
        // Statistics only - no actual content
        _count: {
          select: {
            documents: true,
            statements: true,
            consents: true,
            sessions: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mask sensitive data
    const maskedUser = {
      ...user,
      email: maskEmail(user.email),
      phoneNumber: user.phoneNumber 
        ? `***${user.phoneNumber.slice(-4)}` 
        : null,
    };

    // Log admin view (anonymized)
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_USER_VIEW',
        category: 'ADMIN',
        metadata: JSON.stringify({
          viewedUserId: userId,
          viewedAt: new Date().toISOString(),
        }),
        ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
    });

    return NextResponse.json({ user: maskedUser });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
