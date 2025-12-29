// Change Password API Route
// Handles password change with old password verification

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { verifyPassword, hashPassword, validatePasswordStrength } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get and verify token
    const token = request.cookies.get('session_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_501' },
 401 }
      );
    }

    const secret = new        { status: TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);

    const body = await request.json();
    const { currentPassword, newPassword, confirmNewPassword } = body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required', code: 'AUTH_502' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: 'New passwords do not match', code: 'AUTH_503' },
        { status: 400 }
      );
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'New password does not meet security requirements',
          code: 'AUTH_504',
          requirements: passwordValidation.checks
        },
        { status: 400 }
      );
    }

    // Get user with current password hash
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        passwordHash: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'AUTH_505' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    
    if (!isCurrentPasswordValid) {
      // Create failed audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          category: 'AUTH',
          metadata: JSON.stringify({
            reason: 'invalid_current_password',
            action: 'password_change',
            timestamp: new Date().toISOString()
          }),
          severity: 'WARN'
        }
      });

      return NextResponse.json(
        { error: 'Current password is incorrect', code: 'AUTH_506' },
        { status: 401 }
      );
    }

    // Check if new password is same as current
    const isSamePassword = await verifyPassword(newPassword, user.passwordHash);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password', code: 'AUTH_507' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_CHANGE',
        category: 'AUTH',
        metadata: JSON.stringify({
          action: 'password_changed',
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully. Please use your new password for future logins.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
