// Profile API Route
// Handles user profile management: GET, PUT (update), and password change

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { verifyPassword, hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Fetch current user profile
export async function GET(request) {
  try {
    // Get and verify token
    const token = request.cookies.get('session_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_401' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        avatar: true,
        role: true,
        language: true,
        timezone: true,
        isVerified: true,
        mfaEnabled: true,
        preferences: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'AUTH_402' },
        { status: 404 }
      );
    }

    // Get consent count
    const consentCount = await prisma.consentRecord.count({
      where: { userId: user.id, status: 'GRANTED' }
    });

    // Get document count
    const documentCount = await prisma.document.count({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        stats: {
          activeConsents: consentCount,
          documentsUploaded: documentCount
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    // Get and verify token
    const token = request.cookies.get('session_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_401' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);

    const body = await request.json();
    const { fullName, phoneNumber, language, timezone, preferences, avatar } = body;

    // Validate phone if provided
    if (phoneNumber) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number', code: 'AUTH_403' },
          { status: 400 }
        );
      }
    }

    // Validate language if provided
    const validLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr'];
    if (language && !validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language selection', code: 'AUTH_404' },
        { status: 400 }
      );
    }

    // Check for phone number conflict
    if (phoneNumber) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          phoneNumber: phoneNumber,
          NOT: { id: payload.userId }
        }
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: 'This phone number is already in use', code: 'AUTH_405' },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData = {
      updatedAt: new Date()
    };

    if (fullName !== undefined) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (language !== undefined) updateData.language = language;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (preferences !== undefined) updateData.preferences = preferences;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        avatar: true,
        role: true,
        language: true,
        timezone: true,
        preferences: true,
        isVerified: true
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.userId,
        action: 'PROFILE_UPDATE',
        category: 'AUTH',
        metadata: JSON.stringify({
          updatedFields: Object.keys(updateData).filter(k => k !== 'updatedAt'),
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
