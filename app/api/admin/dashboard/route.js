// Admin Dashboard API - System overview and analytics
// Privacy-preserving, anonymized data

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/lib/auth';

const prisma = new PrismaClient();

// ============================================
// GET /api/admin/dashboard - Get system overview
// ============================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 24h, 7d, 30d, 90d

    // Calculate date range
    const now = new Date();
    let startDate = new Date(now);
    
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
    }

    // Rate limiting for admin endpoints
    const rateLimit = checkRateLimit('admin_dashboard', 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parallel fetch all metrics
    const [
      userStats,
      roleDistribution,
      documentStats,
      statementStats,
      consentStats,
      recentUsers,
      recentActivity,
      dailyMetrics,
      systemHealth,
    ] = await Promise.all([
      // Total and active users
      Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            lastLoginAt: { gte: startDate },
          },
        }),
        prisma.user.count({
          where: { isActive: true },
        }),
        prisma.user.count({
          where: { isActive: false },
        }),
      ]).then(([total, active, activeCount, inactive]) => ({
        total,
        activeThisPeriod: active,
        currentlyActive: activeCount,
        inactive,
      })),

      // User distribution by role
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }).then(groups => 
        groups.reduce((acc, g) => {
          acc[g.role] = g._count.id;
          return acc;
        }, {})
      ),

      // Document statistics
      Promise.all([
        prisma.document.count(),
        prisma.document.count({
          where: { status: 'READY' },
        }),
        prisma.document.count({
          where: { createdAt: { gte: startDate } },
        }),
      ]).then(([total, ready, newThisPeriod]) => ({
        total,
        ready,
        newThisPeriod,
      })),

      // Statement statistics
      Promise.all([
        prisma.victimStatement.count(),
        prisma.victimStatement.count({
          where: { status: 'FINAL' },
        }),
        prisma.victimStatement.count({
          where: { createdAt: { gte: startDate } },
        }),
      ]).then(([total, finalCount, newThisPeriod]) => ({
        total,
        final: finalCount,
        newThisPeriod,
      })),

      // Consent statistics
      Promise.all([
        prisma.consentRecord.count(),
        prisma.consentRecord.count({
          where: { status: 'GRANTED' },
        }),
        prisma.consentRecord.count({
          where: { status: 'REVOKED' },
        }),
      ]).then(([total, granted, revoked]) => ({
        total,
        granted,
        revoked,
        activeRate: total > 0 ? ((granted / total) * 100).toFixed(1) : 0,
      })),

      // Recent user registrations (meta-data only)
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          lastLoginAt: true,
          // No sensitive fields
        },
      }),

      // Recent system activity
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { timestamp: 'desc' },
        where: {
          category: 'ADMIN',
          severity: { in: ['WARN', 'CRITICAL'] },
        },
        select: {
          id: true,
          action: true,
          severity: true,
          timestamp: true,
          userId: true,
          // No metadata (encrypted)
        },
      }),

      // Daily metrics for charts
      prisma.dailyMetrics.findMany({
        where: {
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
        select: {
          date: true,
          newUsers: true,
          activeUsers: true,
          documentsUploaded: true,
          statementsRecorded: true,
        },
      }),

      // System health check
      Promise.all([
        prisma.user.count(), // DB connectivity check
      ]).then(() => ({
        status: 'healthy',
        database: 'connected',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      })),
    ]);

    return NextResponse.json({
      period,
      timestamp: new Date().toISOString(),
      overview: {
        totalUsers: userStats.total,
        activeUsers: userStats.activeThisPeriod,
        currentlyOnline: userStats.currentlyActive,
        inactiveAccounts: userStats.inactive,
      },
      roleDistribution,
      documents: documentStats,
      statements: statementStats,
      consents: consentStats,
      recentUsers: recentUsers.map(u => ({
        ...u,
        email: `${u.email[0]}***@***.${u.email.split('.').pop()}` // Mask email
      })),
      alerts: recentActivity,
      trends: dailyMetrics,
      systemHealth,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
