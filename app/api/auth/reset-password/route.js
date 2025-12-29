// Reset Password API Route
// Handles password reset with verification token

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, validatePasswordStrength, generateToken } from '@/lib/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required', code: 'AUTH_301' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation are required', code: 'AUTH_302' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match', code: 'AUTH_303' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          code: 'AUTH_304',
          requirements: passwordValidation.checks
        },
        { status: 400 }
      );
    }

    // Hash the token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching reset token
    // Note: We're using mfaSecret field to store reset token hash
    const user = await prisma.user.findFirst({
      where: {
        mfaSecret: hashedToken,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        lastLoginAt: true // Used to store token expiration
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token', code: 'AUTH_305' },
        { status: 400 }
      );
    }

    // Check if token has expired (stored in lastLoginAt)
    if (user.lastLoginAt && new Date(user.lastLoginAt) < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new password reset.', code: 'AUTH_306' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(password);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        mfaSecret: null, // Clear reset token
        lastLoginAt: null, // Clear expiration
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
          action: 'password_reset',
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    // Invalidate all existing sessions by generating new token version
    // (Optional: you could also delete all sessions from the database)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting password. Please try again.', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
