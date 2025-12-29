// Consent API Route
// Handles consent management: GET list, POST create

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - List consent records for current user
export async function GET(request) {
  try {
    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'CONSENT_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const recipient = searchParams.get('recipient');

    // Build where clause
    const where = {
      userId: payload.id,
    };

    if (status) {
      where.status = status;
    }

    if (recipient) {
      where.recipientName = { contains: recipient };
    }

    // Get consent records
    const consents = await prisma.consentRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        recipientName: true,
        recipientType: true,
        purpose: true,
        dataTypes: true,
        status: true,
        grantedAt: true,
        expiresAt: true,
        revokedAt: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: { consents }
    });

  } catch (error) {
    console.error('Get consents error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consent records', code: 'CONSENT_500' },
      { status: 500 }
    );
  }
}

// POST - Create new consent record
export async function POST(request) {
  try {
    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'CONSENT_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    const body = await request.json();
    const { recipientName, recipientType, purpose, dataTypes, expiresAt } = body;

    // Validate required fields
    if (!recipientName || !recipientType || !purpose || !dataTypes) {
      return NextResponse.json(
        { success: false, error: 'All fields are required', code: 'CONSENT_400' },
        { status: 400 }
      );
    }

    // Validate recipient type
    const validRecipientTypes = ['NGO', 'LEGAL_AID', 'GOVERNMENT', 'COURT', 'OTHER'];
    if (!validRecipientTypes.includes(recipientType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipient type', code: 'CONSENT_400' },
        { status: 400 }
      );
    }

    // Validate data types
    const validDataTypes = ['PERSONAL', 'CONTACT', 'DOCUMENT', 'STATEMENT', 'FINANCIAL', 'MEDICAL', 'LEGAL'];
    const dataTypesArray = Array.isArray(dataTypes) ? dataTypes : [dataTypes];
    const invalidTypes = dataTypesArray.filter(t => !validDataTypes.includes(t));
    if (invalidTypes.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid data types: ${invalidTypes.join(', ')}`, code: 'CONSENT_400' },
        { status: 400 }
      );
    }

    // Parse expiry date if provided
    let expiryDate = null;
    if (expiresAt) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid expiry date', code: 'CONSENT_400' },
          { status: 400 }
        );
      }
    }

    // Create consent record
    const consent = await prisma.consentRecord.create({
      data: {
        userId: payload.id,
        recipientName,
        recipientType,
        purpose,
        dataTypes: dataTypesArray,
        status: 'GRANTED',
        grantedAt: new Date(),
        expiresAt: expiryDate,
        ipHash: null, // Could capture from request headers
      },
      select: {
        id: true,
        recipientName: true,
        recipientType: true,
        purpose: true,
        dataTypes: true,
        status: true,
        grantedAt: true,
        expiresAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'CONSENT_CREATE',
        category: 'CONSENT',
        resource: 'consent',
        resourceId: consent.id,
        metadata: JSON.stringify({
          recipientName,
          recipientType,
          purpose,
          dataTypes: dataTypesArray,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Consent record created successfully',
      data: { consent }
    }, { status: 201 });

  } catch (error) {
    console.error('Create consent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create consent record', code: 'CONSENT_500' },
      { status: 500 }
    );
  }
}
