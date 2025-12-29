// Logout API Route
// Handles user logout and session termination

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get token from cookies or authorization header
    const token = request.cookies.get('session_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // No token to logout - still return success to prevent timing attacks
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // Verify token and get user info
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      const { payload } = await jwtVerify(token, secret);
      
      // Create logout audit log
      if (payload.userId) {
        await prisma.auditLog.create({
          data: {
            userId: payload.userId,
            action: 'LOGOUT',
            category: 'AUTH',
            metadata: JSON.stringify({
              timestamp: new Date().toISOString()
            }),
            severity: 'INFO'
          }
        });
      }
    } catch (verifyError) {
      // Token invalid or expired - still clear cookie
      console.log('Token verification failed during logout:', verifyError.message);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the session cookie
    response.cookies.delete('session_token');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
