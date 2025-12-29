// Client-compatible Authentication Utilities
// This file contains functions that work in both client and server environments
// Safe to import in any component or API route

// ============================================
// PASSWORD STRENGTH VALIDATION (Client-safe)
// ============================================

/**
 * Validate password strength (client-compatible version)
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
// VALIDATION UTILITIES (Client-safe)
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

// ============================================
// DATA MASKING (Privacy-preserving) - Client-safe
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

// ============================================
// CLIENT-SIDE TOKEN GENERATION (Web Crypto API)
// ============================================

/**
 * Generate a secure random token using Web Crypto API (client-safe)
 */
export function generateToken(length = 32) {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for server-side (will be replaced by auth-server.js imports)
  return '';
}

/**
 * Generate a numeric OTP (client-safe)
 */
export function generateOTP(length = 6) {
  const digits = '0123456789';
  if (typeof window !== 'undefined' && window.crypto) {
    const values = new Uint8Array(length);
    window.crypto.getRandomValues(values);
    return Array.from(values, (byte) => digits[byte % 10]).join('');
  }
  // Fallback for server-side
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// ============================================
// RATE LIMITING (In-memory, client-compatible)
// ============================================

// Client-side rate limiting uses localStorage
const rateLimitStore = typeof window !== 'undefined' ? new Map() : null;

/**
 * Simple in-memory rate limiter (client-side version using localStorage)
 */
export function checkRateLimit(key, limit = 5, windowMs = 60000) {
  if (typeof window === 'undefined') {
    // Server-side: always allow (actual rate limiting happens in API routes)
    return { allowed: true, remaining: limit, resetIn: 0 };
  }
  
  const now = Date.now();
  const storageKey = `ratelimit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    let timestamps = stored ? JSON.parse(stored) : [];
    
    // Filter out old timestamps
    timestamps = timestamps.filter(ts => ts > now - windowMs);
    
    // Add current timestamp
    timestamps.push(now);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(timestamps));
    
    const allowed = timestamps.length <= limit;
    const remaining = Math.max(0, limit - timestamps.length);
    const resetIn = timestamps.length > limit ? windowMs - (now - timestamps[0]) : 0;
    
    return { allowed, remaining, resetIn };
  } catch (e) {
    // If localStorage is full or unavailable, allow the request
    return { allowed: true, remaining: limit, resetIn: 0 };
  }
}

/**
 * Cleanup old rate limit entries (client-side)
 */
export function cleanupRateLimits() {
  if (typeof window === 'undefined') return;
  
  const now = Date.now();
  const maxAge = 60000; // 1 minute
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ratelimit_')) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const timestamps = JSON.parse(stored);
          const valid = timestamps.filter(ts => ts > now - maxAge);
          if (valid.length === 0) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(valid));
          }
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
  }
}

// ============================================
// ROLE PERMISSIONS (Client-safe)
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
