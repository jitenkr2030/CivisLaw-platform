// User Management Module - API Route Handlers
// Handles user registration, profile management, consent, and audit logs

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  verifyPassword, 
  generateOTP, 
  isValidEmail, 
  validatePasswordStrength,
  maskEmail,
  hashIp,
  checkRateLimit,
  generateToken,
  getTokenExpiration,
} from '@/lib/auth';

const prisma = new PrismaClient();

// ============================================
// GET /api/user/profile - Get user profile
// ============================================
export async function GET(request, { params }) {
  try {
    const userId = params.userId;
    
    // Fetch user (exclude sensitive data)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        language: true,
        timezone: true,
        preferences: true,
        mfaEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        ngoProfile: {
          select: {
            organizationName: true,
            region: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/user/profile - Update user profile
// ============================================
export async function PATCH(request, { params }) {
  try {
    const userId = params.userId;
    const body = await request.json();
    const { fullName, phoneNumber, language, timezone, preferences } = body;

    // Rate limiting
    const rateLimit = checkRateLimit(`profile_update_${userId}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate phone if provided
    if (phoneNumber) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }

      // Check uniqueness
      const existingPhone = await prisma.user.findFirst({
        where: { 
          phoneNumber,
          id: { not: userId },
        },
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: 'Phone number already in use' },
          { status: 409 }
        );
      }
    }

    // Validate language
    const validLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr'];
    if (language && !validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(language && { language }),
        ...(timezone && { timezone }),
        ...(preferences && { preferences }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        language: true,
        timezone: true,
        preferences: true,
        updatedAt: true,
      },
    });

    // Log the profile update
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATE',
        category: 'USER',
        metadata: JSON.stringify({
          updatedFields: Object.keys(body),
        }),
        ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/user - Delete user account
// ============================================
export async function DELETE(request, { params }) {
  try {
    const userId = params.userId;
    const body = await request.json();
    const { password, reason } = body;

    // Verify password for security
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      // Log failed deletion attempt
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DATA_DELETE_REQUEST',
          category: 'USER',
          severity: 'WARN',
          metadata: JSON.stringify({ success: false, reason: 'Invalid password' }),
          ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
        },
      });

      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Soft delete - deactivate account instead of hard delete
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        email: `deleted_${Date.now()}@deleted.local`, // Anonymize email
        phoneNumber: null,
        passwordHash: '', // Invalidate password
      },
    });

    // Log account deletion
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_DELETE_REQUEST',
        category: 'USER',
        severity: 'WARN',
        metadata: JSON.stringify({ 
          reason: reason || 'User requested deletion',
          timestamp: new Date().toISOString(),
        }),
        ipHash: hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
    });

    return NextResponse.json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
