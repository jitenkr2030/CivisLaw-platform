// Server-only Authentication Utilities
// This file contains functions that require Node.js built-in modules
// These should only be imported in API routes and server-side code

import { verify } from 'argon2';
import crypto from 'crypto';

// Configuration constants
const PASSWORD_SALT_LEN = 16;
const PASSWORD_HASH_LEN = 32;
const ARGON2_PARAMS = {
  memoryCost: 2 ** 16, // 64MB
  timeCost: 3,
  parallelism: 4,
};

/**
 * Hash a password using Argon2id (secure against GPU attacks)
 */
export async function hashPassword(password) {
  return await hash(password, {
    type: argon2.argon2id,
    memoryCost: ARGON2_PARAMS.memoryCost,
    timeCost: ARGON2_PARAMS.timeCost,
    parallelism: ARGON2_PARAMS.parallelism,
    hashLength: PASSWORD_HASH_LEN,
  });
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password, storedHash) {
  try {
    // Argon2 hashes are stored in PHC format ($argon2id$v=19$...), not base64
    // Use the hash as-is for verification
    return await verify(storedHash, password);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a secure random token (Node.js version)
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
// ENCRYPTION UTILITIES (AES-256-GCM) - Server Only
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

/**
 * Hash IP address for audit logging (one-way)
 */
export function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

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
