// Next.js Middleware for Route Protection
// Handles authentication and role-based access control

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/recover',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/recover',
];

// Routes that require admin role
const adminRoutes = [
  '/admin',
  '/api/admin',
];

// API routes that require authentication
const protectedApiRoutes = [
  '/api/user',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // 2. Get token from cookies or headers
  const token = request.cookies.get('session_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // 3. For API routes, require authentication
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    try {
      // Verify token (implement with jose or your preferred library)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      const { payload } = await jwtVerify(token, secret);
      
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-role', payload.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }
  
  // 4. For admin routes, require admin role
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      const { payload } = await jwtVerify(token, secret);
      
      // Check if user has admin role
      if (payload.role !== 'ADMIN') {
        // Return 403 for API routes
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
        
        // Redirect to home for web routes
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Add admin info to headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-role', payload.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Redirect to login on token error
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // 5. For protected pages, require authentication
  const protectedPages = [
    '/profile',
    '/settings',
    '/documents',
    '/statements',
    '/consent',
  ];
  
  if (protectedPages.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      const { payload } = await jwtVerify(token, secret);
      
      // Add user info to headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-role', payload.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api health check
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/health).*)',
  ],
};
