'use client';

import React from 'react';
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

import ReduxProvider from "@/components/ReduxProvider";
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicHeader from '@/components/Header/PublicHeader/PublicHeader.jsx';
import PublicFooter from '@/components/Footer/PublicFooter/PublicFooter.jsx';
import ChatModal from '@/components/ChatModal';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const ConditionalHeaderFooter = ({ children }) => {
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check if current path is auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname);
  
  // Check if current path is dashboard pages (user or admin)
  const isDashboardPage = pathname.startsWith('/user/') || pathname.startsWith('/admin/');
  
  // Check if current path is public pages (not auth or dashboard)
  const isPublicPage = !isAuthPage && !isDashboardPage;
  
  // Check authentication from session storage as fallback
  const [sessionAuth, setSessionAuth] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('access_token');
      setSessionAuth(!!token);
    }
  }, []);

  // Use Redux state if available, otherwise fall back to session storage
  const userIsAuthenticated = isAuthenticated || sessionAuth;
  
  // Show header and footer only if:
  // 1. Not on auth pages AND
  // 2. Not authenticated AND not on dashboard pages
  // 3. Client has hydrated
  const shouldShowHeaderFooter = !isAuthPage && !userIsAuthenticated && !isDashboardPage && isClient;

  // If user is authenticated and on public pages, redirect to dashboard
  React.useEffect(() => {
    if (userIsAuthenticated && isPublicPage && isClient) {
      // Get user role from session storage
      const userRole = sessionStorage.getItem('userRole');
      const dashboardRoute = userRole === 'super_admin' || userRole === 'admin' 
        ? '/admin/dashboard' 
        : '/user/dashboard';
      
      window.location.href = dashboardRoute;
    }
  }, [userIsAuthenticated, isPublicPage, isClient]);

  return (
    <>
      {/* Skip link for a11y */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      {/* Client header */}
      {shouldShowHeaderFooter && <PublicHeader />}

      {/* Main content */}
      <main id="main">{children}</main>

      {/* Client footer */}
      {shouldShowHeaderFooter && <PublicFooter />}
    </>
  );
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideChatOnRoutes = ['/login', '/register', '/reset-password', '/forgot-password'];
  const shouldShowChat = !hideChatOnRoutes.includes(pathname);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased bg-white text-gray-900 min-h-screen`}
      >
        <ReduxProvider>
          <ConditionalHeaderFooter>
            {children}
          </ConditionalHeaderFooter>

          {/* Global Chat Assistant - visible on all pages (pre/post login) */}
          {shouldShowChat && <ChatModal panelType="default" />}

          {/* Toasts */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            draggable
            pauseOnHover
            pauseOnFocusLoss={false}
            closeButton
            theme="light"
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
