'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Google OAuth Callback Handler Component
 */
function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const handleCallback = async () => {
        try {
            // Get the authorization code from URL params
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            if (error) {
            throw new Error('Google authentication was cancelled or failed');
            }

            if (!code) {
            throw new Error('No authorization code received');
            }

            // Exchange code for tokens by calling your backend
            const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            }
            );

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Google authentication failed');
            }

            const data = await response.json();

            // Store user in cookie for persistence
            Cookies.set('user', JSON.stringify(data.user), { expires: 30 });

            // Update auth store
            setAuth(data.user, data.accessToken, data.refreshToken);

            toast.success(`Welcome, ${data.user.displayName}!`);
            router.push('/dashboard/home');
        } catch (error: unknown) {
            console.error('Google OAuth Error:', error);
            const errorMessage =
                typeof error === 'object' && error !== null && 'message' in error
                    ? (error as { message?: string }).message
                    : 'Authentication failed';
            toast.error(errorMessage || 'Authentication failed');
            router.push('/auth/login');
        }
        };

        handleCallback();
    }, [searchParams, router, setAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
        </div>

        <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 mb-6 shadow-glow animate-float">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            </div>
            <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Completing Google Sign In...
            </h2>
            <p className="text-gray-600 text-lg">Please wait while we set up your account</p>
        </div>
        </div>
    );
}

/**
 * Google OAuth Callback Page with Suspense
 * Required for useSearchParams hook
 */
export default function GoogleCallbackPage() {
    return (
        <Suspense
        fallback={
            <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        }
        >
        <GoogleCallbackContent />
        </Suspense>
    );
}