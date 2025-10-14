import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/auth-store';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * Custom hook for authentication operations
 * Provides login, register, logout, and Google OAuth functionality
 */
export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setAuth, logout: clearAuth } = useAuthStore();

    /**
     * Register mutation
     */
    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
        // Store user in cookie for auth store persistence
        Cookies.set('user', JSON.stringify(data.user), { expires: 30 });
        
        // Update global auth state
        setAuth(data.user, data.accessToken, data.refreshToken);
        
        toast.success(`Welcome, ${data.user.displayName}!`);
        router.push('/dashboard/home');
        },
        onError: (error: unknown) => {
        let errorMessage = 'Registration failed';
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { data?: { message?: string } } };
            errorMessage = err.response?.data?.message || errorMessage;
        }
        toast.error(errorMessage);
        },

    });

    /**
     * Login mutation
     */
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
        // Store user in cookie for auth store persistence
        Cookies.set('user', JSON.stringify(data.user), { expires: 30 });
        
        // Update global auth state
        setAuth(data.user, data.accessToken, data.refreshToken);
        
        toast.success(`Welcome back, ${data.user.displayName}!`);
        router.push('/dashboard/home');
        },
        onError: (error: unknown) => {
        let errorMessage = 'Login failed';
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { data?: { message?: string } } };
            errorMessage = err.response?.data?.message || errorMessage;
        }
        toast.error(errorMessage);
        },

    });

    /**
     * Logout mutation
     */
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
        // Clear auth state
        clearAuth();
        
        // Clear all cached queries
        queryClient.clear();
        
        toast.success('Logged out successfully');
        router.push('/auth/login');
        },
        onError: () => {
        // Even if API call fails, clear local state
        clearAuth();
        queryClient.clear();
        router.push('/auth/login');
        },
    });

    /**
     * Google OAuth login
     * Redirects to backend Google OAuth endpoint
     */
    const googleLogin = async () => {
        try {
        console.log('Initiating Google OAuth...');
        
        // Get the Google OAuth URL from your backend
        const { url } = await authApi.googleLogin();
        
        console.log('Google OAuth URL:', url);
        
        // Redirect to Google OAuth URL (provided by backend)
        if (url) {
            window.location.href = url;
        } else {
            throw new Error('No OAuth URL returned from backend');
        }
        } catch (error: unknown) {
        let errorMessage = 'Google login failed';
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { data?: { message?: string } } };
            errorMessage = err.response?.data?.message || errorMessage;
        }
        toast.error(errorMessage);
        }

    };

    /**
     * Register user
     */
    const register = (data: RegisterRequest) => {
        registerMutation.mutate(data);
    };

    /**
     * Login user
     */
    const login = (data: LoginRequest) => {
        loginMutation.mutate(data);
    };

    /**
     * Logout user
     */
    const logout = () => {
        logoutMutation.mutate();
    };

    return {
        register,
        login,
        logout,
        googleLogin,
        isLoading: registerMutation.isPending || loginMutation.isPending || logoutMutation.isPending,
        isRegistering: registerMutation.isPending,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
    };
};