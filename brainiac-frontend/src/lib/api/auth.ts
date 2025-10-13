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
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Login user with email and password
     * POST /api/auth/login
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Initiate Google OAuth login
     * GET /api/auth/google
     * Returns the Google OAuth URL to redirect to
     */
    googleLogin: async (): Promise<{ url: string }> => {
        const response = await apiClient.get<{ url: string }>('/auth/google');
        return response.data;
    },

    /**
     * Logout user
     * POST /api/auth/logout
     */
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    refreshToken: async (data: RefreshTokenRequest): Promise<{ accessToken: string }> => {
        const response = await apiClient.post<{ accessToken: string }>(
        '/auth/refresh',
        data
        );
        return response.data;
    },

    /**
     * Request password reset
     * POST /api/auth/forgot-password
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>(
        '/auth/forgot-password',
        data
        );
        return response.data;
    },

    /**
     * Reset password with token
     * POST /api/auth/reset-password
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>(
        '/auth/reset-password',
        data
        );
        return response.data;
    },

    /**
     * Verify email with token
     * GET /api/auth/verify-email?token=xxx
     */
    verifyEmail: async (token: string): Promise<{ message: string }> => {
        const response = await apiClient.get<{ message: string }>(
        `/auth/verify-email?token=${token}`
        );
        return response.data;
    },

    /**
     * Resend verification email
     * POST /api/auth/resend-verification
     */
    resendVerification: async (email: string): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>(
        '/auth/resend-verification',
        { email }
        );
        return response.data;
    },

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },
};

export default authApi;