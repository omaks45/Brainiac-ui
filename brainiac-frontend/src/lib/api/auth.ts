import apiClient from './client';
import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    RefreshTokenRequest,
    User,
} from '../types/auth.types';

/**
 * Authentication API service
 * Contains all authentication-related API calls
 */
export const authApi = {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        console.log('Calling API: POST /auth/register');
        console.log('Request data:', { ...data, password: '[HIDDEN]' });
        
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        
        console.log('Registration response:', {
        user: response.data.user,
        hasTokens: !!(response.data.accessToken && response.data.refreshToken)
        });
        
        return response.data;
    },

    /**
     * Login user with email and password
     * POST /api/auth/login
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        console.log('Calling API: POST /auth/login');
        console.log('Request data:', { email: data.email, password: '[HIDDEN]' });

        const response = await apiClient.post<AuthResponse>('/auth/login', data);

        console.log('Login response:', {
        user: response.data.user,
        hasTokens: !!(response.data.accessToken && response.data.refreshToken)
        });
        
        return response.data;
    },

    /**
     * Initiate Google OAuth login
     * GET /api/auth/google
     * Returns the Google OAuth URL to redirect to
     */
    googleLogin: async (): Promise<{ url: string }> => {
        console.log('Calling API: GET /auth/google');
        const response = await apiClient.get<{ url: string }>('/auth/google');
        console.log('Google OAuth URL received:', response.data.url);
        return response.data;
    },

    /**
     * Logout user
     * POST /api/auth/logout
     */
    logout: async (): Promise<void> => {
        console.log('Calling API: POST /auth/logout');
        await apiClient.post('/auth/logout');
        console.log('Logout successful');
    },

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    refreshToken: async (data: RefreshTokenRequest): Promise<{ accessToken: string }> => {
        console.log('Calling API: POST /auth/refresh');
        const response = await apiClient.post<{ accessToken: string }>(
        '/auth/refresh',
        data
        );
        console.log('Token refreshed');
        return response.data;
    },

    /**
     * Request password reset
     * POST /api/auth/forgot-password
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
        console.log('Calling API: POST /auth/forgot-password');
        const response = await apiClient.post<{ message: string }>(
        '/auth/forgot-password',
        data
        );
        console.log('Password reset email sent');
        return response.data;
    },

    /**
     * Reset password with token
     * POST /api/auth/reset-password
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
        console.log('Calling API: POST /auth/reset-password');
        const response = await apiClient.post<{ message: string }>(
        '/auth/reset-password',
        data
        );
        console.log('Password reset successful');
        return response.data;
    },

    /**
     * Verify email with token
     * GET /api/auth/verify-email?token=xxx
     */
    verifyEmail: async (token: string): Promise<{ message: string }> => {
        console.log('Calling API: GET /auth/verify-email');
        const response = await apiClient.get<{ message: string }>(
        `/auth/verify-email?token=${token}`
        );
        console.log('Email verified');
        return response.data;
    },

    /**
     * Resend verification email
     * POST /api/auth/resend-verification
     */
    resendVerification: async (email: string): Promise<{ message: string }> => {
        console.log('Calling API: POST /auth/resend-verification');
        const response = await apiClient.post<{ message: string }>(
        '/auth/resend-verification',
        { email }
        );
        console.log('Verification email resent');
        return response.data;
    },

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    getCurrentUser: async (): Promise<User> => {
        console.log('Calling API: GET /auth/me');
        const response = await apiClient.get<User>('/auth/me');
        console.log('Current user retrieved:', response.data.email);
        return response.data;
    },
};

export default authApi;