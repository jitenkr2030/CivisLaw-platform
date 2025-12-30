// Login API Route
// Handles user authentication with email/phone, password verification, and session creation

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/lib/auth-server';
import { createToken } from '@/lib/jwt';
import { checkRateLimit } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { emailOrPhone, password, rememberMe } = body;

    // Validate required fields
    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/phone and password are required', code: 'AUTH_101' },
        { status: 400 }
      );
    }

    // Rate limiting - 5 attempts per minute
    const rateLimitKey = `login:${emailOrPhone.includes('@') ? emailOrPhone.toLowerCase() : emailOrPhone}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again in a moment.',
          code: 'AUTH_102',
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        },
        { status: 429 }
      );
    }

    // Find user by email or phone
    const isEmail = emailOrPhone.includes('@');
    const whereClause = isEmail
      ? { email: emailOrPhone.toLowerCase() }
      : { phoneNumber: emailOrPhone };

    const user = await prisma.user.findFirst({
      where: whereClause,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        passwordHash: true,
        role: true,
        isActive: true,
        language: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    // User not found
    if (!user) {
      // Create failed login audit log (without user ID)
      await prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          category: 'AUTH',
          metadata: JSON.stringify({
            method: isEmail ? 'email' : 'phone',
            identifier: isEmail ? emailOrPhone.substring(0, 3) + '***' : '***' + emailOrPhone.slice(-2),
            reason: 'user_not_found',
            timestamp: new Date().toISOString()
          }),
          severity: 'WARN'
        }
      });

      return NextResponse.json(
        { success: false, error: 'Invalid email/phone or password', code: 'AUTH_103' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'This account has been deactivated. Please contact support.', code: 'AUTH_104' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      // Create failed login audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          category: 'AUTH',
          metadata: JSON.stringify({
            method: isEmail ? 'email' : 'phone',
            reason: 'invalid_password',
            timestamp: new Date().toISOString()
          }),
          severity: 'WARN'
        }
      });

      return NextResponse.json(
        { success: false, error: 'Invalid email/phone or password', code: 'AUTH_105' },
        { status: 401 }
      );
    }

    // Generate JWT token using jose
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.fullName,
      language: user.language,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date()
      }
    });

    // Create success login audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        category: 'AUTH',
        metadata: JSON.stringify({
          method: isEmail ? 'email' : 'phone',
          rememberMe,
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    // Prepare user response (exclude sensitive data)
    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive,
      language: user.language,
    };

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      }
    }, { status: 200 });

    // Set secure HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7 days or 1 day
      path: '/'
    };

    response.cookies.set('auth_token', token, cookieOptions);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login. Please try again.', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
