'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth } from '@/store/slices/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import AuthModulePattern from '@/app/assets/AuthModulePattern.png';
import AuthForm from '@/app/assets/AuthForm.png';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .refine((val) => val === val.trim(), {
            message: 'Email must not have leading or trailing spaces',
        })
        .refine((val) => !/\s/.test(val), {
            message: 'Email must not contain spaces',
        })
        .refine((val) => /^[^@]+@[^@]+\.[^@]+$/.test(val), {
            message: 'Please enter a valid email address',
        })
        .transform((val) => val.trim()),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be no more than 20 characters')
        .refine((val) => !/\s/.test(val), {
            message: 'Password must not contain spaces',
        }),
});

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [sessionId, setSessionId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthenticated } = useSelector(selectAuth) || false;

    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const handleAuthSuccess = useCallback(() => {
        const target = callbackUrl.startsWith('http')
            ? callbackUrl
            : `${window.location.origin}${callbackUrl}`;
        window.location.href = target;
    }, [callbackUrl]);

    const handleAuthError = useCallback(
        (error) => {
            const message =
                error?.message || 'Login failed. Please check your credentials.';
            setError('root', { message });
            toast.error(message);
        },
        [setError]
    );

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        clearErrors('root');

        try {
            const result = await dispatch(
                login({
                    email: data.email,
                    password: data.password,
                    sessionId,
                })
            );
            if (result.meta.requestStatus === 'fulfilled') {
                handleAuthSuccess();
            } else {
                handleAuthError(result.error);
            }
        } catch (err) {
            handleAuthError({ message: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setSessionId(sessionStorage.getItem('sessionId'));
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="relative flex min-h-screen gap-5 p-5 lg:p-8 xl:p-16">
            {/* Top pattern for mobile */}
            <div className="block absolute top-0 left-3/6 transform -translate-x-3/6 w-[335px] h-[160px] lg:hidden">
                <Image
                    src={AuthModulePattern}
                    alt="Auth pattern"
                    width={400}
                    height={400}
                />
            </div>

            {/* Form Section */}
            <div className="flex flex-col items-center justify-center flex-1">
                <h2 className="text-3xl font-bold lg:hidden xl:text-5xl text-primary-dark pb-9">
                    T.H.E.M.
                </h2>
                <h1 className="text-5xl font-bold text-primary-dark">Log in</h1>
                <p className="pt-3 text-base text-text-muted">
                    Welcome back! Please enter your details
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-[500px] space-y-4 pt-10"
                >
                    {/* Email */}
                    <div>
                        <div className="relative flex items-center border border-[#E5E7EC] p-3 gap-2 rounded-lg">
                            <Mail className="text-primary-dark" />
                            <input
                                type="text"
                                placeholder="Your email"
                                {...register('email')}
                                onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                                onPaste={(e) => {
                                    const paste = e.clipboardData.getData('text');
                                    if (/\s/.test(paste)) e.preventDefault();
                                }}
                                className="w-full outline-0 text-primary-dark"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <div className="relative flex items-center border border-[#E5E7EC] p-3 gap-2 rounded-lg">
                            <Lock className="text-primary-dark" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                {...register('password')}
                                onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                                onPaste={(e) => {
                                    const paste = e.clipboardData.getData('text');
                                    if (/\s/.test(paste)) e.preventDefault();
                                }}
                                className="w-full outline-0 text-primary-dark"
                            />
                            <button
                                type="button"
                                className="text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Forgot link */}
                    <div className="flex items-center justify-end text-sm text-gray-600">
                        <Link href="/forgot-password" className="font-semibold text-primary-dark">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="mr-2">Logging in...</span>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-teal" />
                            </>
                        ) : (
                            'Log in'
                        )}
                    </Button>
                </form>

                {/* Register link */}
                <p className="mt-8 text-sm text-gray-600 lg:mt-4">
                    Don’t have an account?{' '}
                    <Link href="/register" className="font-semibold text-primary-dark">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Image side */}
            <div className="flex-1 hidden lg:flex items-end justify-center bg-org-primary-light-50 rounded-[100px] rounded-bl-none relative p-10 xl:p-20">
                <div className="w-full">
                    <Image
                        src={AuthForm}
                        alt="T.H.E.M. Illustration"
                        className="w-full"
                        width={400}
                        height={400}
                        priority
                    />
                    {/* Static brand mark (org-less) */}
                    <img
                        className="absolute w-20 text-3xl font-bold xl:text-5xl text-primary-dark top-16 right-16"
                        src="/them_logo.svg"
                        alt="T.H.E.M. logo"
                    />
                </div>
            </div>
        </div>
    );
}
