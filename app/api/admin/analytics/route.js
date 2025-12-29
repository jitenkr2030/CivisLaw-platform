// Admin Analytics API Route
// Returns aggregated statistics for admin dashboard

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Get analytics data (admin only)
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
    const rateLimit = checkRateLimit('admin_analytics', 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests', code: 'ADMIN_429' },
        { status: 429 }
      );
    }

    // Parse query parameters for date range
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all analytics in parallel
    const [
      userStats,
      documentStats,
      statementStats,
      consentStats,
      recentActivity,
      roleDistribution,
      statusDistribution,
    ] = await Promise.all([
      // User statistics
      prisma.user.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Document statistics
      prisma.document.groupBy({
        by: ['type', 'status'],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Statement statistics
      prisma.statement.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Consent statistics
      prisma.consentRecord.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Recent activity
      prisma.auditLog.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          action: true,
          category: true,
          severity: true,
          createdAt: true,
          user: {
            select: {
              role: true,
              email: true,
            },
          },
        },
      }),

      // User distribution by role
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),

      // User distribution by status
      prisma.user.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // Calculate totals
    const totalUsers = await prisma.user.count();
    const totalDocuments = await prisma.document.count();
    const totalStatements = await prisma.statement.count();
    const totalConsents = await prisma.consentRecord.count();

    // Calculate new users in period
    const newUsers = userStats._count;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDocuments,
          totalStatements,
          totalConsents,
          newUsersInPeriod: newUsers,
          periodDays: days,
        },
        documents: {
          byType: documentStats.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + item._count;
            return acc;
          }, {}),
          byStatus: documentStats.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + item._count;
            return acc;
          }, {}),
        },
        statements: {
          total: statementStats._count,
        },
        consents: {
          total: consentStats._count,
        },
        distribution: {
          byRole: roleDistribution.reduce((acc, item) => {
            acc[item.role] = item._count;
            return acc;
          }, {}),
          byStatus: statusDistribution.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {}),
        },
        recentActivity,
      }
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}
