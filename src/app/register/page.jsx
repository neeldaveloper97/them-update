'use client';

import {
  register as registerThunk,
} from '@/store/slices/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as z from 'zod';

import AuthForm from '@/assets/AuthForm.png';
import AuthModulePattern from '@/assets/AuthModulePattern.png';
import PersonIcon from '@/assets/svg/Person.svg';
import LockIcon from '@/assets/svg/icon-lock.svg';
import MailIcon from '@/assets/svg/icon-mail.svg';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// ----------------------
// SCHEMA WITH WHITESPACE VALIDATION
// ----------------------
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, 'First name must be at least 3 characters')
      .refine((val) => val === val.trim(), {
        message: 'First name must not have leading or trailing spaces',
      })
      .refine((val) => !/\s/.test(val), {
        message: 'First name must not contain spaces',
      })
      .refine((val) => /^[A-Za-z]+$/.test(val), {
        message: 'First name must contain only letters',
      }),

    lastName: z
      .string()
      .min(3, 'Last name must be at least 3 characters')
      .refine((val) => val === val.trim(), {
        message: 'Last name must not have leading or trailing spaces',
      })
      .refine((val) => !/\s/.test(val), {
        message: 'Last name must not contain spaces',
      })
      .refine((val) => /^[A-Za-z]+$/.test(val), {
        message: 'Last name must contain only letters',
      }),

    email: z
      .string()
      .email('Invalid email address')
      .refine((val) => val === val.trim(), {
        message: 'Email must not have leading or trailing spaces',
      })
      .refine((val) => !/\s/.test(val), {
        message: 'Email must not contain spaces',
      })
      .refine((val) => val === val.toLowerCase(), {
        message: 'Email must be lowercase',
      })
      .refine((val) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(val), {
        message:
          'Email must be valid and end with a proper domain like .com, .net, .org',
      }),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be no more than 20 characters')
      .refine((val) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(val), {
        message: 'Password must include at least one letter and one number',
      })
      .refine((val) => !/\s/.test(val), {
        message: 'Password must not contain spaces',
      }),

    confirmPassword: z
      .string()
      .min(6, 'Please confirm your password')
      .refine((val) => !/\s/.test(val), {
        message: 'Confirm password must not contain spaces',
      }),

    terms: z
      .boolean()
      .refine((val) => val === true, 'You must agree to terms.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatUserId, setChatUserId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSessionId(sessionStorage.getItem('sessionId'));
      setChatUserId(sessionStorage.getItem('chatUserId'));
    }
  }, []);

  const preventWhitespace = {
    onKeyDown: (e) => {
      if (e.key === ' ') e.preventDefault();
    },
    onPaste: (e) => {
      const paste = e.clipboardData.getData('text');
      if (/\s/.test(paste)) e.preventDefault();
    },
  };

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      terms: data.terms,
      sessionId,
      userId: chatUserId,
      agent: 'them', // org-less default; remove if your API doesn't need it
    };

    try {
      setIsLoading(true);
      const resultAction = await dispatch(registerThunk(payload));
      if (registerThunk.fulfilled.match(resultAction)) {
        router.push('/login');
      }
    } catch (err) {
      // handle error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen gap-5 p-5 lg:p-8 xl:p-16">
      <div className="block absolute top-0 left-3/6 transform -translate-x-3/6 w-[335px] h-[160px] lg:hidden z-10">
        <Image src={AuthModulePattern} alt="Pattern" width={400} height={400} />
      </div>

      <div className="relative z-50 flex flex-col items-center justify-center flex-1 px-8">
        <h1 className="text-4xl font-bold lg:text-5xl text-primary-color-dark">
          Register as
        </h1>
        <p className="pt-3 text-base text-center text-muted-text">
          Welcome to T.H.E.M. Please enter your details
        </p>

        <Tabs defaultValue="account" className="max-w-[500px] w-full mt-4">
          <TabsList className="w-full h-auto p-0 bg-transparent" />
          <TabsContent value="account" className="max-w-[500px] w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: 'firstName', placeholder: 'First Name' },
                  { name: 'lastName', placeholder: 'Last Name' },
                ].map(({ name, placeholder }) => (
                  <div key={name}>
                    <div className="relative flex items-center border border-[#E5E7EC] p-3 gap-2 rounded-lg">
                      <Image
                        src={PersonIcon}
                        width={24}
                        height={24}
                        alt="Person"
                      />
                      <input
                        type="text"
                        placeholder={placeholder}
                        {...register(name)}
                        disabled={isLoading}
                        {...preventWhitespace}
                        className="w-full outline-0"
                      />
                    </div>
                    {errors[name] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <div className="relative flex items-center border border-[#E5E7EC] p-3 gap-2 rounded-lg">
                  <Image src={MailIcon} width={24} height={24} alt="Mail" />
                  <input
                    type="text"
                    placeholder="Your email"
                    {...register('email')}
                    disabled={isLoading}
                    {...preventWhitespace}
                    className="w-full outline-0"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative flex items-center border border-[#E5E7EC] p-3 gap-2 rounded-lg">
                  <Image src={LockIcon} width={24} height={24} alt="Lock" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    disabled={isLoading}
                    {...preventWhitespace}
                    className="flex-1 outline-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye color="#64748B" size={24} />
                    ) : (
                      <EyeOff color="#64748B" size={24} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative flex items-center border border-[#E5E7EC] p-3 gap-2 rounded-lg">
                  <Image src={LockIcon} width={24} height={24} alt="Lock" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                    {...preventWhitespace}
                    className="flex-1 outline-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <Eye color="#64748B" size={24} />
                    ) : (
                      <EyeOff color="#64748B" size={24} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    {...register('terms')}
                    disabled={isLoading}
                  />
                  <p className="text-xs">
                    I agree to the{' '}
                    <a href="#" className="text-primary-dark">
                      Terms and Conditions
                    </a>{' '}
                    and the{' '}
                    <a href="#" className="text-primary-dark">
                      Data Protection Declaration
                    </a>
                    .
                  </p>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Creating account...</span>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            <p className="mt-8 text-sm text-center text-gray-600 pt-14">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-dark">
                Sign In
              </Link>
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Illustration */}
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
