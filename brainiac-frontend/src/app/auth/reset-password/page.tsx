'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

/**
 * Reset password form validation schema
 */
const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Reset Password Content Component
 */
function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
        toast.error('Invalid or missing reset token');
        return;
        }

        setIsLoading(true);
        try {
        await authApi.resetPassword({
            token,
            newPassword: data.newPassword,
        });
        setIsSuccess(true);
        toast.success('Password reset successful!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
            router.push('/auth/login');
        }, 3000);
        } catch (error) {
            const errorMessage = 
            error instanceof Error 
                ? error.message 
                : 'Failed to reset password';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Show error if no token
    if (!token) {
        return (
        <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h3>
            <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
            </p>
            <Link href="/auth/forgot-password">
            <Button variant="primary">Request New Link</Button>
            </Link>
        </div>
        );
    }

    return (
        <>
        {isSuccess ? (
            // Success Message
            <div className="text-center py-8 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
            <p className="text-gray-600 mb-6">
                Your password has been changed successfully.
                <br />
                Redirecting to login...
            </p>
            <Link href="/auth/login">
                <Button variant="primary">Go to Login</Button>
            </Link>
            </div>
        ) : (
            // Form
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.newPassword?.message}
                {...register('newPassword')}
            />

            <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your new password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="mt-6"
            >
                Reset Password
            </Button>

            <div className="text-center mt-6">
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
            </form>
        )}
        </>
    );
    }

    /**
     * Reset Password Page Component
     * Allows users to set a new password using the reset token
     */
    export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
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
                Reset Password
            </h1>
            <p className="text-gray-600 text-lg">Enter your new password below</p>
            </div>

            <Card variant="elevated" className="glass animate-slide-up border-white/40">
            <CardHeader>
                <CardTitle className="text-2xl">Set New Password</CardTitle>
                <CardDescription className="text-base">
                Choose a strong password for your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Suspense fallback={
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
                }>
                <ResetPasswordContent />
                </Suspense>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}