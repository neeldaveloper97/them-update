import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get stored values from cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle admin routes
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // Handle user routes
  if (pathname.startsWith('/user') && !['user', 'admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add routes that need protection
    '/admin/:path*',
    '/user/:path*',
    // Add public routes to be handled
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ],
};
