/**
 * User object returned from the backend
 */
export interface User {
    _id: string;
    email: string;
    username: string;
    displayName: string;
    avatar: string;
    role: 'user' | 'admin';
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Authentication response from login/register endpoints
 */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

/**
 * Login request payload
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
    email: string;
    username: string;
    displayName: string;
    password: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
    email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Token payload structure
 */
export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}