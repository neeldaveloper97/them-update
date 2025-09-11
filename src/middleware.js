import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/about-us', '/contact-us', '/faq', '/what-we-do', '/terms-and-conditions'];
const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];

// Define dashboard routes based on roles
const getDashboardRoute = (userRole) => {
  const dashboardRoutes = {
    'admin': '/admin/dashboard',
    'user': '/user/dashboard',
    'super_admin': '/admin/dashboard'
  };
  return dashboardRoutes[userRole] || '/user/dashboard';
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get stored values from cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && authPages.includes(pathname)) {
    const dashboardRoute = getDashboardRoute(userRole);
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  // If user is authenticated and trying to access public pages (except auth pages), redirect to dashboard
  if (isAuthenticated && publicRoutes.includes(pathname) && !authPages.includes(pathname)) {
    const dashboardRoute = getDashboardRoute(userRole);
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  // Allow access to public routes for non-authenticated users
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle admin routes
  if (pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // Redirect /admin to /admin/dashboard for admin users
  if (pathname === '/admin' && ['admin', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Handle user routes
  if (pathname.startsWith('/user') && !['user', 'admin', 'super_admin'].includes(userRole)) {
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
    '/reset-password',
    '/about-us',
    '/contact-us',
    '/faq',
    '/what-we-do',
    '/terms-and-conditions'
  ],
};
