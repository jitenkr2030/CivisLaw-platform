// Auth Me API Route
// GET /api/auth/me - Returns current authenticated user

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get token from cookies or authorization header
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated', code: 'AUTH_UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload, valid, error } = await verifyToken(token);

    if (!valid || !payload) {
      return NextResponse.json(
        { success: false, error: error || 'Invalid token', code: 'AUTH_INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        language: true,
        isVerified: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true,
        preferences: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'AUTH_USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user info', code: 'AUTH_ERROR' },
      { status: 500 }
    );
  }
}
