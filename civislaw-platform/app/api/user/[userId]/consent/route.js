// Consent Management API - Handle user consent and privacy controls
// Privacy-first approach with full user control

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashIp, checkRateLimit } from '../../lib/auth.js';

const prisma = new PrismaClient();

// ============================================
// GET /api/user/consent - Get user's consent records
// ============================================
export async function GET(request, { params }) {
  try {
    const userId = params.userId;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // GRANTED, REVOKED, PENDING
    const grantedTo = searchParams.get('grantedTo');

    const where = {
      userId,
      ...(status && { status: status.toUpperCase() }),
      ...(grantedTo && { grantedTo }),
    };

    const consents = await prisma.consentRecord.findMany({
      where,
      orderBy: { grantedAt: 'desc' },
      select: {
        id: true,
        resourceId: true,
        resourceType: true,
        grantedTo: true,
        grantedToName: true,
        status: true,
        grantedAt: true,
        expiresAt: true,
        revokedAt: true,
        revocationReason: true,
      },
    });

    // Group by resource for better display
    const groupedConsents = consents.reduce((acc, consent) => {
      const key = `${consent.resourceType}_${consent.resourceId}`;
      if (!acc[key]) {
        acc[key] = {
          resourceId: consent.resourceId,
          resourceType: consent.resourceType,
          accessList: [],
        };
      }
      acc[key].accessList.push({
        id: consent.id,
        grantedTo: consent.grantedTo,
        grantedToName: consent.grantedToName,
        status: consent.status,
        grantedAt: consent.grantedAt,
        expiresAt: consent.expiresAt,
      });
      return acc;
    }, {});

    return NextResponse.json({
      consents: Object.values(groupedConsents),
      total: consents.length,
    });
  } catch (error) {
    console.error('Get consents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent records' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/user/consent - Grant or update consent
// ============================================
export async function POST(request, { params }) {
  try {
    const userId = params.userId;
    const body = await request.json();
    const { resourceId, resourceType, grantedTo, grantedToName, expiresInDays } = body;

    // Rate limiting
    const rateLimit = checkRateLimit(`consent_${userId}`, 20, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many consent changes. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate resource type
    const validTypes = ['DOCUMENT', 'STATEMENT', 'AUDIO_RECORDING', 'TRANSLATION', 'CASE_FILE'];
    if (!validTypes.includes(resourceType)) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      );
    }

    // Calculate expiration
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    }

    // Upsert consent record
    const consent = await prisma.consentRecord.upsert({
      where: {
        userId_resourceId_grantedTo: {
          userId,
          resourceId,
          grantedTo,
        },
      },
      update: {
        status: 'GRANTED',
        grantedAt: new Date(),
        expiresAt,
        revokedAt: null,
        revocationReason: null,
      },
      create: {
        userId,
        resourceId,
        resourceType,
        grantedTo,
        grantedToName: grantedToName || grantedTo,
        status: 'GRANTED',
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Log consent grant
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CONSENT_GRANTED',
        category: 'CONSENT',
        metadata: JSON.stringify({
          resourceId,
          resourceType,
          grantedTo,
          expiresAt: expiresAt?.toISOString(),
        }),
        ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
    });

    return NextResponse.json({
      consent,
      message: 'Consent granted successfully',
    });
  } catch (error) {
    console.error('Grant consent error:', error);
    return NextResponse.json(
      { error: 'Failed to grant consent' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/user/consent - Revoke consent
// ============================================
export async function DELETE(request, { params }) {
  try {
    const userId = params.userId;
    const { searchParams } = new URL(request.url);
    const consentId = searchParams.get('id');
    const resourceId = searchParams.get('resourceId');
    const grantedTo = searchParams.get('grantedTo');
    const reason = searchParams.get('reason') || 'User revoked consent';

    if (!consentId && (!resourceId || !grantedTo)) {
      return NextResponse.json(
        { error: 'Either consentId or (resourceId + grantedTo) is required' },
        { status: 400 }
      );
    }

    const where = consentId
      ? { id: consentId, userId }
      : { userId, resourceId, grantedTo };

    // Update consent record
    const consent = await prisma.consentRecord.updateMany({
      where,
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revocationReason: reason,
      },
    });

    if (consent.count === 0) {
      return NextResponse.json(
        { error: 'Consent record not found' },
        { status: 404 }
      );
    }

    // Log consent revocation
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CONSENT_REVOKED',
        category: 'CONSENT',
        metadata: JSON.stringify({
          resourceId,
          grantedTo,
          reason,
        }),
        ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
    });

    return NextResponse.json({
      message: 'Consent revoked successfully',
    });
  } catch (error) {
    console.error('Revoke consent error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke consent' },
      { status: 500 }
    );
  }
}
