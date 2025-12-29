// Forgot Password API Route
// Handles password reset requests by sending a reset link to the user's email

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, checkRateLimit } from '@/lib/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

// In production, use a proper email service like SendGrid, AWS SES, etc.
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  // Email template (in production, use a proper email template system)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0F172A; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .button { 
          display: inline-block; 
          padding: 12px 30px; 
          background-color: #3B82F6; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>CivisLaw Password Reset</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested a password reset for your CivisLaw account. Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from CivisLaw.</p>
          <p>© ${new Date().getFullYear()} CivisLaw. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // In production, use actual email service
  console.log(`[EMAIL] Password reset email sent to ${email}`);
  console.log(`[EMAIL] Reset URL: ${resetUrl}`);
  
  // Example with nodemailer (uncomment and configure in production):
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ to: email, subject: 'Password Reset', html: emailHtml });

  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required', code: 'AUTH_201' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address', code: 'AUTH_202' },
        { status: 400 }
      );
    }

    // Rate limiting - 3 requests per hour per email
    const rateLimitKey = `forgot:${email.toLowerCase()}`;
    const rateLimit = checkRateLimit(rateLimitKey, 3, 3600000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password reset requests. Please try again later.',
          code: 'AUTH_203',
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true
      }
    });

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we show the same message
    const successResponse = {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    };

    if (!user) {
      return NextResponse.json(successResponse);
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(successResponse);
    }

    // Generate reset token (cryptographically secure)
    const resetToken = generateToken(32);
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store reset token with expiration (1 hour)
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Store hashed token for security (never store plain text tokens)
        mfaSecret: hashedToken, // Reusing this field for reset token
        lastLoginAt: resetExpires // Store expiration time
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ACCOUNT_RECOVERY',
        category: 'AUTH',
        metadata: JSON.stringify({
          action: 'password_reset_requested',
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.', code: 'AUTH_204' },
        { status: 500 }
      );
    }

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.', code: 'AUTH_500' },
      { status: 500 }
    );
  }
}
