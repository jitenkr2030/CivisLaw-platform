// Consent Detail API Route
// Handles single consent operations: GET, PUT, DELETE (revoke)

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - Get single consent record
export async function GET(request, { params }) {
  try {
    const { id } = params;

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

    // Get consent record
    const consent = await prisma.consentRecord.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!consent) {
      return NextResponse.json(
        { success: false, error: 'Consent record not found', code: 'CONSENT_404' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { consent }
    });

  } catch (error) {
    console.error('Get consent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consent record', code: 'CONSENT_500' },
      { status: 500 }
    );
  }
}

// PUT - Update consent record
export async function PUT(request, { params }) {
  try {
    const { id } = params;

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
    const { purpose, dataTypes, expiresAt } = body;

    // Check consent exists and belongs to user
    const existingConsent = await prisma.consentRecord.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingConsent) {
      return NextResponse.json(
        { success: false, error: 'Consent record not found', code: 'CONSENT_404' },
        { status: 404 }
      );
    }

    // Check if consent is still active
    if (existingConsent.status !== 'GRANTED') {
      return NextResponse.json(
        { success: false, error: 'Cannot update a consent that is not active', code: 'CONSENT_400' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData = {
      updatedAt: new Date()
    };

    if (purpose !== undefined) updateData.purpose = purpose;

    if (dataTypes !== undefined) {
      const validDataTypes = ['PERSONAL', 'CONTACT', 'DOCUMENT', 'STATEMENT', 'FINANCIAL', 'MEDICAL', 'LEGAL'];
      const dataTypesArray = Array.isArray(dataTypes) ? dataTypes : [dataTypes];
      const invalidTypes = dataTypesArray.filter(t => !validDataTypes.includes(t));
      if (invalidTypes.length > 0) {
        return NextResponse.json(
          { success: false, error: `Invalid data types: ${invalidTypes.join(', ')}`, code: 'CONSENT_400' },
          { status: 400 }
        );
      }
      updateData.dataTypes = dataTypesArray;
    }

    if (expiresAt !== undefined) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid expiry date', code: 'CONSENT_400' },
          { status: 400 }
        );
      }
      updateData.expiresAt = expiryDate;
    }

    // Update consent
    const consent = await prisma.consentRecord.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        recipientName: true,
        recipientType: true,
        purpose: true,
        dataTypes: true,
        status: true,
        expiresAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Consent record updated successfully',
      data: { consent }
    });

  } catch (error) {
    console.error('Update consent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update consent record', code: 'CONSENT_500' },
      { status: 500 }
    );
  }
}

// POST - Revoke consent
export async function POST(request, { params }) {
  try {
    const { id } = params;

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

    // Check consent exists and belongs to user
    const existingConsent = await prisma.consentRecord.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingConsent) {
      return NextResponse.json(
        { success: false, error: 'Consent record not found', code: 'CONSENT_404' },
        { status: 404 }
      );
    }

    // Check if already revoked
    if (existingConsent.status === 'REVOKED') {
      return NextResponse.json(
        { success: false, error: 'Consent has already been revoked', code: 'CONSENT_400' },
        { status: 400 }
      );
    }

    // Revoke consent
    const consent = await prisma.consentRecord.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        recipientName: true,
        recipientType: true,
        status: true,
        grantedAt: true,
        revokedAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'CONSENT_REVOKE',
        category: 'CONSENT',
        resource: 'consent',
        resourceId: id,
        metadata: JSON.stringify({
          recipientName: consent.recipientName,
          recipientType: consent.recipientType,
          grantedAt: consent.grantedAt,
          revokedAt: consent.revokedAt,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Consent revoked successfully',
      data: { consent }
    });

  } catch (error) {
    console.error('Revoke consent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke consent', code: 'CONSENT_500' },
      { status: 500 }
    );
  }
}

// DELETE - Delete consent record (only if not granted/active)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

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

    // Check consent exists and belongs to user
    const existingConsent = await prisma.consentRecord.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingConsent) {
      return NextResponse.json(
        { success: false, error: 'Consent record not found', code: 'CONSENT_404' },
        { status: 404 }
      );
    }

    // Only allow delete if not active (already revoked or expired)
    if (existingConsent.status === 'GRANTED') {
      return NextResponse.json(
        { success: false, error: 'Please revoke the consent first before deleting', code: 'CONSENT_400' },
        { status: 400 }
      );
    }

    // Delete consent
    await prisma.consentRecord.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Consent record deleted successfully'
    });

  } catch (error) {
    console.error('Delete consent error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete consent record', code: 'CONSENT_500' },
      { status: 500 }
    );
  }
}
