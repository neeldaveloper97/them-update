'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import IllustrationImg from '@/app/assets/forgot-password-illustration.png';

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        window.scrollTo(0, 0);
        // if (!token) setError('Invalid or missing reset token. Please request a new link.');
    }, [token]);

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        try {
            const resetToken = searchParams.get('token');
            const response = await authService.resetPassword({
                resetToken,
                newPassword,
            });
            if (response.success) {
                setMessage('Password has been successfully reset!');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(response.message);
            }
        } catch (error) {
            // setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'new') {
            setShowPassword((v) => !v);
        } else {
            setShowConfirmPassword((v) => !v);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-gray-50 sm:py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full max-w-6xl overflow-hidden bg-white rounded-lg shadow-xl md:flex-row">
                <div className="flex justify-center pt-8 pb-4 md:hidden">
                    <h2 className="text-2xl font-bold text-teal-700">
                        T.H.E.M.(Transformative Healthcare Expenses Mediators)
                    </h2>
                </div>

                <div className="w-full p-8 md:w-1/2 md:p-12 lg:p-16 xl:p-20">
                    <div className="max-w-md mx-auto">
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Reset password</h2>
                        <p className="mb-8 text-gray-600">
                            You're almost there! Set a new password to secure your account.
                        </p>

                        {error && (
                            <div className="p-3 mb-4 text-sm text-red-600 rounded-md bg-red-50">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 mb-4 text-sm text-green-600 rounded-md bg-green-50">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => togglePasswordVisibility('new')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            {showPassword ? (
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            ) : (
                                                <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            {showConfirmPassword ? (
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            ) : (
                                                <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 text-white transition-colors bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : 'Continue'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-sm text-gray-600 transition-colors hover:text-teal-600">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="relative hidden w-1/2 md:block bg-sky-50">
                    <div className="absolute top-8 right-8">
                        <h2 className="text-2xl font-bold text-teal-700">
                            T.H.E.M.(Transformative Healthcare Expenses Mediators)
                        </h2>
                    </div>
                    <div className="flex items-center justify-center h-full p-8">
                        <Image
                            src={IllustrationImg.src}
                            alt="Password reset illustration"
                            width={500}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    Loading...
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
