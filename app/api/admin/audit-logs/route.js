// Admin Audit Logs API Route
// Returns audit logs for admin review

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - List audit logs (admin only)
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
    const rateLimit = checkRateLimit('admin_audit_logs', 60, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests', code: 'ADMIN_429' },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const action = searchParams.get('action');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where = {};

    if (action) {
      where.action = { contains: action, mode: 'insensitive' };
    }

    if (category) {
      where.category = category.toUpperCase();
    }

    if (severity) {
      where.severity = severity.toUpperCase();
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Get audit logs with pagination
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          action: true,
          category: true,
          severity: true,
          metadata: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              role: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });

  } catch (error) {
    console.error('Admin audit logs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}
