// Authentication and Security Utilities
// Privacy-first, offline-capable authentication system

import { hash, verify } from 'argon2';
import crypto from 'crypto';

// Configuration constants
const PASSWORD_SALT_LEN = 16;
const PASSWORD_HASH_LEN = 32;
const ARGON2_PARAMS = {
  memoryCost: 2 ** 16, // 64MB
  timeCost: 3,
  parallelism: 4,
};

// ============================================
// PASSWORD HANDLING
// ============================================

/**
 * Hash a password using Argon2id (secure against GPU attacks)
 */
export async function hashPassword(password) {
  const passwordBuffer = Buffer.from(password, 'utf-8');
  const hashBuffer = await hash(passwordBuffer, {
    memoryCost: ARGON2_PARAMS.memoryCost,
    timeCost: ARGON2_PARAMS.timeCost,
    parallelism: ARGON2_PARAMS.parallelism,
    hashLength: PASSWORD_HASH_LEN,
  });
  return hashBuffer.toString('base64');
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password, storedHash) {
  try {
    const passwordBuffer = Buffer.from(password, 'utf-8');
    const hashBuffer = Buffer.from(storedHash, 'base64');
    return await verify(hashBuffer, passwordBuffer);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (byte) => charset[byte % charset.length]).join('');
}

// ============================================
// TOKEN GENERATION
// ============================================

/**
 * Generate a secure random token
 */
export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a numeric OTP
 */
export function generateOTP(length = 6) {
  const digits = '0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (byte) => digits[byte % 10]).join('');
}

// ============================================
// ENCRYPTION UTILITIES (AES-256-GCM)
// ============================================

const ALGORITHM = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;

/**
 * Encrypt data using AES-256-GCM
 * Returns: iv:tag:encryptedData (base64 encoded)
 */
export function encryptData(data, key) {
  const keyBuffer = Buffer.from(key, 'hex');
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  // Combine iv + tag + encrypted data
  const combined = Buffer.concat([
    iv,
    tag,
    Buffer.from(encrypted, 'hex'),
  ]);
  
  return combined.toString('base64');
}

/**
 * Decrypt data using AES-256-GCM
 */
export function decryptData(encryptedData, key) {
  const keyBuffer = Buffer.from(key, 'hex');
  const combined = Buffer.from(encryptedData, 'base64');
  
  // Extract iv, tag, and encrypted data
  const iv = combined.subarray(0, IV_LEN);
  const tag = combined.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const encrypted = combined.subarray(IV_LEN + TAG_LEN);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

/**
 * Derive encryption key from password using PBKDF2
 */
export function deriveKeyFromPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Generate a master key for offline encryption
 */
export function generateMasterKey() {
  return crypto.randomBytes(32).toString('hex');
}

// ============================================
// DATA MASKING (Privacy-preserving)
// ============================================

/**
 * Mask email for privacy
 */
export function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `**@${domain}`;
  }
  return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

/**
 * Mask phone number for privacy
 */
export function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) {
    return '*'.repeat(digits.length);
  }
  return '*'.repeat(digits.length - 4) + digits.slice(-4);
}

/**
 * Hash IP address for audit logging (one-way)
 */
export function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Create session tokens
 */
export function createSessionTokens() {
  return {
    sessionToken: generateToken(32),
    refreshToken: generateToken(32),
  };
}

/**
 * Calculate token expiration
 */
export function getTokenExpiration(expireMinutes = 60) {
  return new Date(Date.now() + expireMinutes * 60 * 1000);
}

// ============================================
// RATE LIMITING
// ============================================

const rateLimitStore = new Map();

/**
 * Simple in-memory rate limiter
 * In production, use Redis for distributed rate limiting
 */
export function checkRateLimit(key, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const timestamps = rateLimitStore.get(key).filter(ts => ts > windowStart);
  timestamps.push(now);
  rateLimitStore.set(key, timestamps);
  
  return {
    allowed: timestamps.length <= limit,
    remaining: Math.max(0, limit - timestamps.length),
    resetIn: timestamps.length > limit ? windowStart + windowMs - now : 0,
  };
}

/**
 * Cleanup old rate limit entries
 */
export function cleanupRateLimits() {
  const now = Date.now();
  const maxAge = 60000; // 1 minute
  
  for (const [key, timestamps] of rateLimitStore) {
    const valid = timestamps.filter(ts => ts > now - maxAge);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, valid);
    }
  }
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password) {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  const isValid = score >= 4;
  
  return {
    isValid,
    score,
    maxScore: 5,
    checks,
    feedback: getPasswordFeedback(checks),
  };
}

function getPasswordFeedback(checks) {
  const feedback = [];
  if (!checks.minLength) feedback.push('At least 8 characters');
  if (!checks.hasUppercase) feedback.push('One uppercase letter');
  if (!checks.hasLowercase) feedback.push('One lowercase letter');
  if (!checks.hasNumber) feedback.push('One number');
  if (!checks.hasSpecial) feedback.push('One special character');
  return feedback;
}

// ============================================
// ROLE PERMISSIONS
// ============================================

export const ROLE_PERMISSIONS = {
  CITIZEN: [
    'profile:read',
    'profile:update',
    'document:upload',
    'document:read',
    'statement:create',
    'statement:read',
    'consent:manage',
    'audit:read_own',
  ],
  VICTIM: [
    'profile:read',
    'profile:update',
    'document:upload',
    'document:read',
    'statement:create',
    'statement:read',
    'statement:transcribe',
    'consent:manage',
    'audit:read_own',
  ],
  NGO: [
    'profile:read',
    'profile:update',
    'document:read',
    'statement:read',
    'statement:transcribe',
    'access:request',
    'access:receive',
    'consent:view_granted',
    'audit:read_own',
    'analytics:read_region',
  ],
  LEGAL_AID: [
    'profile:read',
    'profile:update',
    'document:read',
    'document:analyze',
    'statement:read',
    'statement:transcribe',
    'access:request',
    'access:receive',
    'consent:view_granted',
    'audit:read_own',
    'analytics:read_region',
  ],
  ADMIN: [
    'admin:read',
    'admin:write',
    'admin:users',
    'admin:roles',
    'admin:logs',
    'admin:analytics',
    'admin:system',
    'admin:announcements',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role, permission) {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}
