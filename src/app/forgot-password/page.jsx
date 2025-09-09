'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AuthForm from '@/app/assets/AuthForm.png';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { authService } from '@/services/authService';

const emailSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .refine((val) => val === val.trim(), {
            message: 'Email must not have leading or trailing spaces',
        })
        .refine((val) => !/\s/.test(val.trim()), {
            message: 'Email must not contain spaces',
        })
        .refine((val) => /^[^@]+@[^@]+\.[^@]+$/.test(val.trim()), {
            message: 'Please enter a valid email address',
        })
        .transform((val) => val.trim()),
});

const otpSchema = z.object({
    otp: z
        .string()
        .nonempty('OTP is required')
        .regex(/^\d{6}$/, 'OTP must be exactly 6 digits and only numbers'),
});

const passwordSchema = z
    .object({
        password: z
            .string()
            .nonempty('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must be no more than 20 characters')
            .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
                message: 'Password must include at least one letter and one number',
            }),
        confirmPassword: z
            .string()
            .nonempty('Please confirm your password')
            .min(6, 'Confirm password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function ForgotPasswordPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const {
        register: registerEmail,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
    } = useForm({ resolver: zodResolver(emailSchema), mode: 'onChange' });

    const {
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
        setValue: setOtpFormValue,
    } = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm({ resolver: zodResolver(passwordSchema) });

    useEffect(() => {
        setOtpFormValue('otp', otp);
    }, [otp, setOtpFormValue]);

    const handleEmailStep = async (data) => {
        setLoading(true);
        setEmail(data.email);
        try {
            const response = await authService.forgotPassword(data.email);
            if (response.success) setStep(2);
        } catch (error) {
            // TODO: show error toast
        } finally {
            setLoading(false);
        }
    };

    const handleOtpStep = async ({ otp }) => {
        setLoading(true);
        try {
            const response = await authService.verifyOtp({ email, otp });
            if (response.success && response.data.resetToken) {
                setResetToken(response.data.resetToken);
                setStep(3);
            }
        } catch (error) {
            // TODO: show error toast
        } finally {
            setLoading(false);
        }
    };

    const preventWhitespace = {
        onKeyDown: (e) => {
            if (e.key === ' ') e.preventDefault();
        },
        onPaste: (e) => {
            const paste = e.clipboardData.getData('text');
            if (/\s/.test(paste)) e.preventDefault();
        },
    };

    const handlePasswordReset = async (data) => {
        setLoading(true);
        try {
            const response = await authService.resetPassword({
                resetToken,
                newPassword: data.password,
            });
            if (response.success) {
                setTimeout(() => router.push('/login'), 1500);
            }
        } catch (error) {
            // TODO: show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen gap-5 p-5 lg:p-8 xl:p-16">
            <div className="flex items-center justify-center w-full p-8 md:w-1/2 md:p-12 lg:p-16 xl:p-20">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-5xl font-bold text-primary-dark">
                        {step === 1 && 'Forgot password'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Reset Password'}
                    </h1>

                    <p className="pt-8 mb-8 text-muted-text">
                        {step === 1 &&
                            "Enter your email address below, and we'll send you a link to reset your password."}
                        {step === 2 && 'Enter the 6-digit OTP sent to your email.'}
                        {step === 3 && 'Set a new password to complete your reset.'}
                    </p>

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit(handleEmailStep)} className="space-y-6">
                            <input
                                type="text"
                                placeholder="Your email"
                                {...registerEmail('email')}
                                {...preventWhitespace}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            />
                            {emailErrors.email && (
                                <p className="text-sm text-left text-red-500">
                                    {emailErrors.email.message}
                                </p>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Continue'}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(val) => {
                                    setOtp(val);
                                    setOtpFormValue('otp', val);
                                }}
                                className="w-full"
                            >
                                <InputOTPGroup className="flex gap-3 justify-center">
                                    {[...Array(6)].map((_, index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="w-12 h-12 text-xl text-center border border-gray-300 rounded-lg"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                            {otpErrors.otp && (
                                <p className="text-sm text-left text-red-500">
                                    {otpErrors.otp.message}
                                </p>
                            )}
                            <Button onClick={handleOtpSubmit(handleOtpStep)} className="w-full" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit(handlePasswordReset)} className="space-y-6">
                            <div className="relative flex items-center border p-3 gap-2 rounded-lg">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    {...registerPassword('password')}
                                    {...preventWhitespace}
                                    className="flex-1 outline-0"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordErrors.password && (
                                <p className="text-sm text-left text-red-500">
                                    {passwordErrors.password.message}
                                </p>
                            )}

                            <div className="relative flex items-center border p-3 gap-2 rounded-lg">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    {...registerPassword('confirmPassword')}
                                    {...preventWhitespace}
                                    className="flex-1 outline-0"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordErrors.confirmPassword && (
                                <p className="text-sm text-left text-red-500">
                                    {passwordErrors.confirmPassword.message}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-gray-600 hover:text-teal-600">
                            Back to Sign In
                        </Link>
                    </div>

                    <div className="mt-8 text-center">
                        <span className="text-sm text-muted-text">Don&apos;t have an account? </span>
                        <Link href="/register" className="text-sm font-medium text-primary-color-dark">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-1 hidden lg:flex items-end justify-center bg-org-primary-light-50 rounded-[100px] rounded-bl-none relative p-10 xl:p-20">
                <div className="w-full">
                    <Image
                        src={AuthForm.src}
                        alt="T.H.E.M. Illustration"
                        className="w-full"
                        width={400}
                        height={400}
                        priority
                    />
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
