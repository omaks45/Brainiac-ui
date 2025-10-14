'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

/**
 * Forgot password form validation schema
 */
const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page Component
 * Allows users to request a password reset email
 */
export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await authApi.forgotPassword(data);
            setIsSuccess(true);
            toast.success('Password reset email sent!');
        } catch (error) {
            const errorMessage = 
            error instanceof Error 
                ? error.message 
                : 'Failed to send reset email';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
        </div>

        <div className="w-full max-w-md animate-fade-in relative z-10">
            {/* Back to Login Link */}
            <Link href="/auth/login" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
            </Link>

            {/* Logo and Title */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 mb-6 shadow-glow animate-float">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                Forgot Password?
            </h1>
            <p className="text-gray-600 text-lg">No worries, we&apos;ll send you reset instructions</p>
            </div>

            <Card variant="elevated" className="glass animate-slide-up border-white/40">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <CardDescription className="text-base">
                Enter your email and we&apos;ll send you a reset link
                </CardDescription>
            </CardHeader>

            <CardContent>
                {isSuccess ? (
                // Success Message
                <div className="text-center py-8 animate-scale-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                    <p className="text-gray-600 mb-6">
                    We&apos;ve sent a password reset link to:
                    <br />
                    <strong className="text-gray-900">{getValues('email')}</strong>
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                    </p>
                    <div className="space-y-3">
                    <Link href="/auth/login">
                        <Button variant="primary" fullWidth>
                        Back to Login
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => setIsSuccess(false)}
                    >
                        Try Another Email
                    </Button>
                    </div>
                </div>
                ) : (
                // Form
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                    label="Email Address"
                    type="email"
                    placeholder="john.doe@example.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                    />

                    <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    className="mt-6"
                    >
                    Send Reset Link
                    </Button>
                </form>
                )}

                {/* Additional Help */}
                <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link
                    href="/auth/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                    Login
                    </Link>
                </p>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}