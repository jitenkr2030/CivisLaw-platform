// Admin Announcements API Route
// Handles system announcements: GET list, POST create

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - List announcements
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Build where clause
    const where = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    // Get announcements with pagination
    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          status: true,
          priority: true,
          startsAt: true,
          expiresAt: true,
          createdAt: true,
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      prisma.announcement.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        announcements,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });

  } catch (error) {
    console.error('Admin announcements list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}

// POST - Create new announcement (admin only)
export async function POST(request) {
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
    const rateLimit = checkRateLimit('admin_announcement_create', 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests', code: 'ADMIN_429' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, content, type, priority, startsAt, expiresAt } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Validate announcement type
    const validTypes = ['GENERAL', 'URGENT', 'MAINTENANCE', 'LEGAL', 'POLICY'];
    if (type && !validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid announcement type', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    if (priority && !validPriorities.includes(priority.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid priority level', code: 'ADMIN_400' },
        { status: 400 }
      );
    }

    // Parse dates
    let startDate = new Date();
    if (startsAt) {
      startDate = new Date(startsAt);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid start date', code: 'ADMIN_400' },
          { status: 400 }
        );
      }
    }

    let expiryDate = null;
    if (expiresAt) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid expiry date', code: 'ADMIN_400' },
          { status: 400 }
        );
      }
    }

    // Create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: (type || 'GENERAL').toUpperCase(),
        priority: (priority || 'MEDIUM').toUpperCase(),
        status: 'ACTIVE',
        startsAt: startDate,
        expiresAt: expiryDate,
        createdById: payload.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        priority: true,
        status: true,
        startsAt: true,
        expiresAt: true,
        createdAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'ADMIN_ANNOUNCEMENT_CREATE',
        category: 'ADMIN',
        resource: 'announcement',
        resourceId: announcement.id,
        metadata: JSON.stringify({
          title: announcement.title,
          type: announcement.type,
          priority: announcement.priority,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      data: { announcement }
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create announcement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}
