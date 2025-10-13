'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';

/**
 * Login form validation schema using Zod
 */
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    });

    type LoginFormData = z.infer<typeof loginSchema>;

    /**
     * Login Page Component
     * Handles user authentication with email/password and Google OAuth
     */
    export default function LoginPage() {
    const { login, googleLogin, isLoggingIn } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        login(data);
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
                Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">Login to continue your learning journey</p>
            </div>

            <Card variant="elevated" className="glass animate-slide-up border-white/40">
            <CardHeader>
                <CardTitle>Login to Brainiac</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
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

                {/* Password Input */}
                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    error={errors.password?.message}
                    {...register('password')}
                />

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                    <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                    Forgot password?
                    </Link>
                </div>

                {/* Login Button */}
                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoggingIn}
                    className="mt-6"
                >
                    Login
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

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                Don&#39;t have an account?{' '}
                <Link
                    href="/auth/signup"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                    Sign up
                </Link>
                </p>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}