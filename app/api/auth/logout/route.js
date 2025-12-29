// Logout API Route
// Handles user logout and session termination

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get token from cookies or authorization header
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // No token to logout - still return success to prevent timing attacks
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // Verify token and get user info
    const { payload } = await verifyToken(token);

    // Create logout audit log
    if (payload && payload.id) {
      await prisma.auditLog.create({
        data: {
          userId: payload.id,
          action: 'LOGOUT',
          category: 'AUTH',
          metadata: JSON.stringify({
            timestamp: new Date().toISOString()
          }),
          severity: 'INFO'
        }
      });
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the auth cookie
    response.cookies.delete('auth_token');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
