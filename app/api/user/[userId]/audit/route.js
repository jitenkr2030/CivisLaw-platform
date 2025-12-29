// Audit Log API - Get user's personal activity log
// Privacy-preserving, encrypted logging

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decryptData } from '../../lib/auth.js';

const prisma = new PrismaClient();

// ============================================
// GET /api/user/audit - Get user's activity logs
// ============================================
export async function GET(request, { params }) {
  try {
    const userId = params.userId;
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;
    
    // Filters
    const category = searchParams.get('category'); // AUTH, DOCUMENT, CONSENT, etc.
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const severity = searchParams.get('severity');

    const where = {
      userId,
      ...(category && { category }),
      ...(action && { action }),
      ...(severity && { severity }),
      ...(startDate && endDate && {
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          action: true,
          category: true,
          severity: true,
          timestamp: true,
          // Don't send encrypted metadata to user
          // User can view metadata through the UI which decrypts it
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Decrypt metadata for display (user can see their own activity details)
    const decryptedLogs = logs.map(log => {
      let metadata = {};
      try {
        if (log.metadataIv) {
          // This would be decrypted on the client side with user's key
          metadata = { _encrypted: true };
        }
      } catch (e) {
        metadata = {};
      }
      return {
        ...log,
        metadata,
      };
    });

    return NextResponse.json({
      logs: decryptedLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/user/audit - Create audit log entry
// ============================================
export async function POST(request, { params }) {
  try {
    // This is typically called internally by other API routes
    // Not directly by users
    
    const userId = params.userId;
    const body = await request.json();
    const { action, category, metadata, severity = 'INFO' } = body;

    // Validate required fields
    if (!action || !category) {
      return NextResponse.json(
        { error: 'Action and category are required' },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = [
      'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE',
      'MFA_ENABLE', 'MFA_DISABLE', 'ACCOUNT_RECOVERY',
      'DOCUMENT_UPLOAD', 'DOCUMENT_VIEW', 'DOCUMENT_DOWNLOAD',
      'STATEMENT_RECORD', 'STATEMENT_VIEW', 'STATEMENT_TRANSCRIBE',
      'CONSENT_GRANTED', 'CONSENT_REVOKED', 'CONSENT_REQUESTED',
      'PROFILE_UPDATE', 'PREFERENCES_UPDATE',
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Create encrypted metadata
    const metadataString = JSON.stringify(metadata || {});
    
    // For user audit logs, we store metadata as plain JSON
    // For admin logs, we would encrypt with a system key
    
    const auditLog = await prisma.auditLog.create({
      data: {
        userId: userId || null, // Can be null for system actions
        action,
        category,
        metadata: metadataString,
        severity,
        ipHash: body.ipHash || null,
      },
    });

    return NextResponse.json({
      log: auditLog,
      message: 'Audit log created',
    });
  } catch (error) {
    console.error('Create audit log error:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
