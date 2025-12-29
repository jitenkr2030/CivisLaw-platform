// Statement Detail API Route
// Handles single statement operations: GET, PUT, DELETE

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - Get single statement
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'STMT_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Get statement
    const statement = await prisma.statement.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!statement) {
      return NextResponse.json(
        { success: false, error: 'Statement not found', code: 'STMT_404' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { statement }
    });

  } catch (error) {
    console.error('Get statement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statement', code: 'STMT_500' },
      { status: 500 }
    );
  }
}

// PUT - Update statement
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'STMT_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    const body = await request.json();
    const { title, content, type, status, language } = body;

    // Check statement exists and belongs to user
    const existingStmt = await prisma.statement.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingStmt) {
      return NextResponse.json(
        { success: false, error: 'Statement not found', code: 'STMT_404' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    if (type !== undefined) {
      const validTypes = ['TESTIMONY', 'STATEMENT', 'AFFIDAVIT', 'COMPLAINT', 'FEEDBACK', 'OTHER'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid statement type', code: 'STMT_400' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (status !== undefined) {
      const validStatuses = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status', code: 'STMT_400' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (language !== undefined) {
      const validLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr'];
      if (!validLanguages.includes(language)) {
        return NextResponse.json(
          { success: false, error: 'Invalid language', code: 'STMT_400' },
          { status: 400 }
        );
      }
      updateData.language = language;
    }

    // Update statement
    const statement = await prisma.statement.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        status: true,
        language: true,
        updatedAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'STATEMENT_UPDATE',
        category: 'STATEMENT',
        resource: 'statement',
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
      message: 'Statement updated successfully',
      data: { statement }
    });

  } catch (error) {
    console.error('Update statement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update statement', code: 'STMT_500' },
      { status: 500 }
    );
  }
}

// DELETE - Delete statement
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'STMT_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check statement exists and belongs to user
    const existingStmt = await prisma.statement.findFirst({
      where: {
        id,
        userId: payload.id,
      },
    });

    if (!existingStmt) {
      return NextResponse.json(
        { success: false, error: 'Statement not found', code: 'STMT_404' },
        { status: 404 }
      );
    }

    // Delete statement
    await prisma.statement.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'STATEMENT_DELETE',
        category: 'STATEMENT',
        resource: 'statement',
        resourceId: id,
        metadata: JSON.stringify({
          title: existingStmt.title,
          type: existingStmt.type,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Statement deleted successfully'
    });

  } catch (error) {
    console.error('Delete statement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete statement', code: 'STMT_500' },
      { status: 500 }
    );
  }
}
