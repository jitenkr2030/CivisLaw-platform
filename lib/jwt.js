// JWT Token Management
// Secure, stateless authentication using JWT

import { SignJWT, jwtVerify } from 'jose';

// Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'civislaw-dev-secret-key-minimum-32-characters-long'
);
const JWT_EXPIRY = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

/**
 * Parse duration string to seconds
 */
function parseDuration(duration) {
  const match = duration.match(/^(\d+)([dhm])$/);
  if (!match) return 7 * 24 * 60 * 60; // Default 7 days

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60;
    case 'h':
      return value * 60 * 60;
    case 'm':
      return value * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

/**
 * Create a JWT token for a user
 */
export async function createToken(payload) {
  const expiresIn = parseDuration(JWT_EXPIRY);

  const token = await new SignJWT({
    ...payload,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn))
    .setSubject(payload.id)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Create a refresh token
 */
export async function createRefreshToken(userId) {
  const expiresIn = parseDuration(REFRESH_EXPIRY);

  const token = await new SignJWT({
    type: 'refresh',
    userId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn))
    .setSubject(userId)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      valid: true,
      payload,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}

/**
 * Decode a token without verification (for debugging)
 */
export function decodeToken(token) {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  return payload.exp * 1000 < Date.now();
}

/**
 * Get token expiration time
 */
export function getTokenExpirationTime(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;

  return new Date(payload.exp * 1000);
}
