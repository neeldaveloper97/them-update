'use client';

import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';

import ReduxProvider from "@/components/ReduxProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicHeader from '@/components/Header/PublicHeader/PublicHeader.jsx';
import PublicFooter from '@/components/Footer/PublicFooter/PublicFooter.jsx';

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

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if current path is login, register or forgot-password
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased bg-white text-gray-900 min-h-screen`}
      >
        <ReduxProvider>
          {/* Skip link for a11y */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded"
          >
            Skip to content
          </a>

          {/* Client header */}
          {!isAuthPage && <PublicHeader />}

          {/* Main content */}
          <main id="main">{children}</main>

          {/* Client footer */}
          {!isAuthPage && <PublicFooter />}

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
