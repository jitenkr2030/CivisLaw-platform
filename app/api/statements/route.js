// Statements API Route
// Handles statement management: GET list, POST create

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - List statements for current user
export async function GET(request) {
  try {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    // Build where clause
    const where = {
      userId: payload.id,
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    // Get statements with pagination
    const [statements, total] = await Promise.all([
      prisma.statement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.statement.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        statements,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });

  } catch (error) {
    console.error('Get statements error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statements', code: 'STMT_500' },
      { status: 500 }
    );
  }
}

// POST - Create new statement
export async function POST(request) {
  try {
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
    const { title, content, type, language } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required', code: 'STMT_400' },
        { status: 400 }
      );
    }

    // Validate statement type
    const validTypes = ['TESTIMONY', 'STATEMENT', 'AFFIDAVIT', 'COMPLAINT', 'FEEDBACK', 'OTHER'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid statement type', code: 'STMT_400' },
        { status: 400 }
      );
    }

    // Validate language
    const validLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr'];
    const statementLanguage = language || 'en';
    if (!validLanguages.includes(statementLanguage)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language', code: 'STMT_400' },
        { status: 400 }
      );
    }

    // Create statement
    const statement = await prisma.statement.create({
      data: {
        userId: payload.id,
        title,
        content,
        type: type || 'STATEMENT',
        language: statementLanguage,
        status: 'DRAFT',
      },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        language: true,
        createdAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'STATEMENT_CREATE',
        category: 'STATEMENT',
        resource: 'statement',
        resourceId: statement.id,
        metadata: JSON.stringify({
          title: statement.title,
          type: statement.type,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Statement created successfully',
      data: { statement }
    }, { status: 201 });

  } catch (error) {
    console.error('Create statement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create statement', code: 'STMT_500' },
      { status: 500 }
    );
  }
}
