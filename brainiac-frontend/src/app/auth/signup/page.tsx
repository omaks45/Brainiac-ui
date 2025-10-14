'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, UserCircle, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';

/**
 * Registration form validation schema (without confirm password)
 */
const signupSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    displayName: z
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name must not exceed 50 characters'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Signup Page Component
 * Handles new user registration
 */
export default function SignupPage() {
    const { register: registerUser, googleLogin, isRegistering } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data: SignupFormData) => {
        registerUser(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-400/10 rounded-full blur-3xl animate-pulse animation-delay-600"></div>
        </div>

        <div className="w-full max-w-md animate-fade-in relative z-10">
            {/* Logo and Title */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 mb-6 shadow-glow animate-float">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                Create Account
            </h1>
            <p className="text-gray-600 text-lg">Join Brainiac and start learning today</p>
            </div>

            <Card variant="elevated" className="glass animate-slide-up border-white/40">
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription className="text-base">Create your account to get started</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Input */}
                <Input
                    label="Email"
                    type="email"
                    placeholder="john.doe@example.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                {/* Username Input */}
                <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.username?.message}
                    {...register('username')}
                />

                {/* Display Name Input */}
                <Input
                    label="Display Name"
                    type="text"
                    placeholder="John Doe"
                    leftIcon={<UserCircle className="w-5 h-5" />}
                    error={errors.displayName?.message}
                    {...register('displayName')}
                />

                {/* Password Input */}
                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    error={errors.password?.message}
                    {...register('password')}
                />

                {/* Password Requirements */}
                <div className="text-xs text-gray-500 space-y-1 pl-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside space-y-0.5 pl-2">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    </ul>
                </div>

                {/* Sign Up Button */}
                <Button
                    type="submit"
                    fullWidth
                    isLoading={isRegistering}
                    className="mt-6"
                >
                    Create Account
                </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
                </div>

                {/* Google OAuth Button */}
                <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={googleLogin}
                leftIcon={<Chrome className="w-5 h-5" />}
                >
                Continue with Google
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link
                    href="/auth/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                    Login
                </Link>
                </p>
            </CardContent>
            </Card>

            {/* Terms and Privacy */}
            <p className="text-center text-xs text-gray-500 mt-6 max-w-sm mx-auto">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">
                Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
            </Link>
            </p>
        </div>
        </div>
    );
}