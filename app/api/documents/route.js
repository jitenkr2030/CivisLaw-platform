// Documents API Route
// Handles document management: GET list, POST create

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - List documents for current user
export async function GET(request) {
  try {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where = {
      userId: payload.id,
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Get documents with pagination
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          status: true,
          fileSize: true,
          mimeType: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        documents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents', code: 'DOC_500' },
      { status: 500 }
    );
  }
}

// POST - Create new document
export async function POST(request) {
  try {
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
    const { title, description, type, content } = body;

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'Title and type are required', code: 'DOC_400' },
        { status: 400 }
      );
    }

    // Validate document type
    const validTypes = ['LEGAL_NOTICE', 'CONTRACT', 'AFFIDAVIT', 'JUDGMENT', 'ORDER', 'PETITION', 'OTHER'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid document type', code: 'DOC_401' },
        { status: 400 }
      );
    }

    // Create document
    const document = await prisma.document.create({
      data: {
        userId: payload.id,
        title,
        description: description || null,
        type,
        content: content || null,
        status: 'DRAFT',
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        createdAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'DOCUMENT_CREATE',
        category: 'DOCUMENT',
        resource: 'document',
        resourceId: document.id,
        metadata: JSON.stringify({
          title: document.title,
          type: document.type,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Document created successfully',
      data: { document }
    }, { status: 201 });

  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document', code: 'DOC_500' },
      { status: 500 }
    );
  }
}
