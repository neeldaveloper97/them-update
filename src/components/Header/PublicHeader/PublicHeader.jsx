'use client';

import { Button } from '@/components/ui/button';
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    Menu,
    Phone,
    Twitter,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

    // Client-only: read session token for auth CTAs
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        setIsLoggedIn(!!token);
        setHasMounted(true);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="w-full">
                <div className="py-3 text-sm text-white bg-primary-color sm:py-4 top_bar">
                    <div className="container relative z-20 flex flex-row items-center justify-between px-4 space-y-2 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:space-x-4 items-start !mb-0 space-y-1 sm:space-y-0">
                            <a
                                href="mailto:info@themediators.net"
                                className="flex items-center space-x-1 text-xs sm:text-sm hover:underline"
                            >
                                <Mail size={12} className="sm:w-4 sm:h-4" />
                                <span>info@themediators.net</span>
                            </a>
                            <a
                                href="tel:+9801234587654"
                                className="flex items-center space-x-1 text-xs sm:text-sm hover:underline"
                            >
                                <Phone size={12} className="sm:w-4 sm:h-4" />
                                <span className="">+980 123 (4587) 584</span>
                            </a>
                        </div>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white/80"
                                aria-label="Facebook"
                            >
                                <Facebook size={14} className="sm:w-4 sm:h-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white/80"
                                aria-label="Instagram"
                            >
                                <Instagram size={14} className="sm:w-4 sm:h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white/80"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={14} className="sm:w-4 sm:h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-white/80"
                                aria-label="Twitter"
                            >
                                <Twitter size={14} className="sm:w-4 sm:h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="sticky top-0 z-50 py-4 bg-white second_bar">
                <div className="container flex items-center justify-between px-4">
                    <Link href="/" className="text-2xl font-semibold leading-relaxed text-primary-dark">
                        {/* Replace with your logo component if available */}
                        <img src="/images/them_logo.svg" alt="T.H.E.M. logo" className="w-14" />
                    </Link>

                    <div>
                        <button
                            className="flex items-center text-gray-700 xl:hidden focus:outline-none cursor-pointer"
                            onClick={toggleMobileMenu}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-nav"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <nav className="items-center hidden xl:flex xl:gap-6 lg:gap-8">
                        {[
                            { href: '/about-us', label: 'About us' },
                            { href: '/what-we-do', label: 'What We Do' },
                            { href: '/faq', label: 'FAQ' },
                            { href: '/contact-us', label: 'Contact Us' },
                            { href: '/terms-and-conditions', label: 'Terms & Conditions' },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-sm transition-colors hover:text-primary-color-dark lg:text-base"
                            >
                                {label}
                            </Link>
                        ))}

                        {hasMounted && !isLoggedIn && (
                            <div className="flex items-center gap-2 lg:gap-3">
                                <Button asChild variant="outline" className="h-auto text-xs lg:text-sm">
                                    <Link href="/register" aria-label="Register">
                                        Register
                                    </Link>
                                </Button>
                                <Button asChild className="h-auto text-xs lg:text-sm">
                                    <Link href="/login" aria-label="Login">
                                        Login
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* If you want a dashboard button for logged-in users, uncomment below */}
                        {/*
            {hasMounted && isLoggedIn && (
              <Button
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="h-auto text-xs lg:text-sm bg-neutral-600 cursor-pointer"
              >
                Go To Dashboard
              </Button>
            )}
            */}
                    </nav>
                </div>
            </div>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
                    onClick={toggleMobileMenu}
                    aria-hidden
                />
            )}

            <div
                id="mobile-nav"
                className={`fixed top-0 right-0 h-full w-80 bg-primary-dark z-[999] p-4 transition-transform duration-300 ease-in-out xl:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
            >
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">
                        <span className="font-bold text-white">T.H.E.M.</span>
                    </p>
                    <button onClick={toggleMobileMenu} aria-label="Close menu">
                        <X className="text-white" />
                    </button>
                </div>

                <nav className="flex flex-col pt-10 space-y-5">
                    {[
                        { href: '/about-us', label: 'About us' },
                        { href: '/what-we-do', label: 'What We Do' },
                        { href: '/faq', label: 'FAQ' },
                        { href: '/contact-us', label: 'Contact Us' },
                        { href: '/terms-and-conditions', label: 'Terms & Conditions' },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="py-1 leading-none text-white transition-colors hover:text-white"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}

                    {hasMounted && !isLoggedIn && (
                        <div className="flex flex-col pt-2 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                            <Button asChild variant="outline" className="justify-center w-full bg-white sm:w-auto">
                                <Link href="/register" aria-label="Register">
                                    Register
                                </Link>
                            </Button>
                            <Button asChild className="justify-center w-full sm:w-auto">
                                <Link href="/login" aria-label="Login">
                                    Login
                                </Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
}
