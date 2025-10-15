'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

/**
 * Email Verification Content Component
 */
function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification token');
            return;
        }

        try {
            console.log('Verifying email with token...');
            const response = await authApi.verifyEmail(token);
            
            setStatus('success');
            setMessage(response.message || 'Email verified successfully!');
            toast.success('Email verified! Redirecting to dashboard...');
            
            // Redirect to dashboard after 2 seconds (if already logged in)
            // Otherwise redirect to login
            setTimeout(() => {
            // Check if user is logged in by checking cookies
            const accessToken = document.cookie.includes('accessToken');
            if (accessToken) {
                router.push('/dashboard/home');
            } else {
                router.push('/auth/login?verified=true');
            }
            }, 2000);
        } catch (error) {
            console.error('Email verification failed:', error);
            setStatus('error');
            if (error instanceof AxiosError) {
            setMessage(
                error.response?.data?.message ||
                'Email verification failed. The link may have expired.'
            );
            } else {
            setMessage('Email verification failed. The link may have expired.');
            }
            toast.error('Email verification failed');
        }

        };

        verifyEmail();
    }, [token, router]);

    const handleResendVerification = async () => {
        if (!email) {
        toast.error('Please enter your email address');
        return;
        }

        try {
        await authApi.resendVerification(email);
        toast.success('Verification email sent! Check your inbox.');
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Failed to resend verification email');
            } else {
                toast.error('Failed to resend verification email');
            }
        }
    };

    return (
        <>
        {status === 'loading' && (
            <div className="text-center py-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h3>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
        )}

        {status === 'success' && (
            <div className="text-center py-8 animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500 mb-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting you to dashboard...</span>
            </div>
            <div className="space-y-3">
                <Link href="/dashboard/home">
                <Button variant="primary" size="lg" fullWidth>
                    Go to Dashboard Now
                </Button>
                </Link>
                <Link href="/auth/login">
                <Button variant="ghost" fullWidth>
                    Go to Login
                </Button>
                </Link>
            </div>
            </div>
        )}

        {status === 'error' && (
            <div className="text-center py-8 animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {/* Resend Verification */}
            <div className="max-w-sm mx-auto mb-6">
                <p className="text-sm text-gray-600 mb-3">
                Need a new verification link? Enter your email below:
                </p>
                <div className="flex gap-2">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Button 
                    variant="secondary" 
                    onClick={handleResendVerification}
                    leftIcon={<Mail className="w-4 h-4" />}
                >
                    Resend
                </Button>
                </div>
            </div>

            <div className="space-y-3">
                <Link href="/auth/login">
                <Button variant="outline" fullWidth>
                    Back to Login
                </Button>
                </Link>
                <Link href="/auth/signup">
                <Button variant="ghost" fullWidth>
                    Create New Account
                </Button>
                </Link>
            </div>
            </div>
        )}
        </>
    );
}

/**
 * Email Verification Page Component
 * Verifies user email from the link sent to their inbox
 * Redirects to dashboard on success
 */
export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
        </div>

        <div className="w-full max-w-md animate-fade-in relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 mb-6 shadow-glow animate-float">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
            </div>

            <Card variant="elevated" className="glass animate-slide-up border-white/40">
            <CardHeader>
                <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
            </CardHeader>

            <CardContent>
                <Suspense fallback={
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
                }>
                <VerifyEmailContent />
                </Suspense>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}