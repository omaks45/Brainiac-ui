'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Providers Component
 * Wraps app with React Query and Toast notifications
 * Also initializes auth state on mount
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create a client instance (must be inside component for SSR)
    const [queryClient] = React.useState(
        () =>
        new QueryClient({
            defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
            },
            },
        })
    );

    // Initialize auth state from cookies on mount
    React.useEffect(() => {
        useAuthStore.getState().initialize();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
        {children}
        
        {/* Toast Notifications */}
        <Toaster
            position="top-right"
            toastOptions={{
            duration: 4000,
            style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
            },
            success: {
                iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
                },
            },
            error: {
                iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
                },
            },
            }}
        />
        </QueryClientProvider>
    );
}