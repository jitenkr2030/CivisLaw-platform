// Document Detail API Route
// Handles single document operations: GET, PUT, DELETE

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - Get single document
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'DOC_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Get document
    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: payload.id, // Ensure user can only access their own documents
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found', code: 'DOC_404' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { document }
    });

  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document', code: 'DOC_500' },
      { status: 500 }
    );
  }
}

// PUT - Update document
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'DOC_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    const body = await request.json();
    const { title, description, type, status, content } = body;

    // Check document exists and belongs to user
    const existingDoc = await prisma.document.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingDoc) {
      return NextResponse.json(
        { success: false, error: 'Document not found', code: 'DOC_404' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) {
      const validTypes = ['LEGAL_NOTICE', 'CONTRACT', 'AFFIDAVIT', 'JUDGMENT', 'ORDER', 'PETITION', 'OTHER'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid document type', code: 'DOC_400' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    if (status !== undefined) {
      const validStatuses = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status', code: 'DOC_400' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (content !== undefined) updateData.content = content;

    // Update document
    const document = await prisma.document.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        content: true,
        updatedAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'DOCUMENT_UPDATE',
        category: 'DOCUMENT',
        resource: 'document',
        resourceId: id,
        metadata: JSON.stringify({
          updatedFields: Object.keys(updateData).filter(k => k !== 'updatedAt'),
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      data: { document }
    });

  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update document', code: 'DOC_500' },
      { status: 500 }
    );
  }
}

// DELETE - Delete document
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'DOC_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check document exists and belongs to user
    const existingDoc = await prisma.document.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingDoc) {
      return NextResponse.json(
        { success: false, error: 'Document not found', code: 'DOC_404' },
        { status: 404 }
      );
    }

    // Delete document
    await prisma.document.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'DOCUMENT_DELETE',
        category: 'DOCUMENT',
        resource: 'document',
        resourceId: id,
        metadata: JSON.stringify({
          title: existingDoc.title,
          type: existingDoc.type,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document', code: 'DOC_500' },
      { status: 500 }
    );
  }
}
