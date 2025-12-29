// Registration API Route
// Handles user registration with email/phone, password validation, and automatic login

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, validatePasswordStrength, isValidEmail, isValidPhone, generateToken } from '@/lib/auth';
import { encryptData } from '@/lib/auth';

const prisma = new PrismaClient();

// Rate limiting store (in production, use Redis)
const registrationAttempts = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phoneNumber, password, confirmPassword, fullName, language } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required', code: 'AUTH_001' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address', code: 'AUTH_002' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          code: 'AUTH_003',
          requirements: passwordValidation.checks
        },
        { status: 400 }
      );
    }

    // Confirm passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match', code: 'AUTH_004' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phoneNumber && !isValidPhone(phoneNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number', code: 'AUTH_005' },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          ...(phoneNumber ? [{ phoneNumber }] : [])
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'An account with this email already exists', code: 'AUTH_006' },
          { status: 409 }
        );
      }
      if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
        return NextResponse.json(
          { error: 'An account with this phone number already exists', code: 'AUTH_007' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate master key for offline encryption (stored encrypted by password)
    const masterKey = generateToken(32);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        phoneNumber: phoneNumber || null,
        passwordHash,
        encryptedMasterKey: encryptData({ key: masterKey }, password),
        fullName,
        language: language || 'en',
        role: 'CITIZEN',
        isActive: true,
        isVerified: false,
        preferences: {
          notifications: true,
          emailUpdates: false,
          language: language || 'en'
        }
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        language: true,
        createdAt: true
      }
    });

    // Create initial profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        preferences: {
          notifications: true,
          emailUpdates: false,
          language: language || 'en',
          theme: 'light'
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        category: 'AUTH',
        metadata: encryptData({
          action: 'registration',
          method: 'email',
          timestamp: new Date().toISOString()
        }, process.env.AUDIT_KEY || 'audit-secret-key'),
        metadataIv: 'initialized',
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        language: user.language
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email or phone already exists', code: 'AUTH_008' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
