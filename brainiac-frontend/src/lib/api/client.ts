import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

/**
 * Base API URL from environment variables
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - Adds access token to all requests
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('accessToken');
        
        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handles token refresh and errors
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = Cookies.get('refreshToken');
            
            if (!refreshToken) {
            throw new Error('No refresh token available');
            }

            // Attempt to refresh the token
            const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
            });

            const { accessToken } = response.data;

            // Store new access token
            Cookies.set('accessToken', accessToken, { expires: 7 });

            // Retry original request with new token
            if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            
            toast.error('Session expired. Please login again.');
            
            if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
            }
            
            return Promise.reject(refreshError);
        }
        }

        // Handle other errors
        type ErrorResponseData = { message?: string };
        const errorMessage = error.response?.data 
        ? (error.response.data as ErrorResponseData).message || 'An error occurred'
        : error.message || 'Network error';

        // Don't show toast for certain pages (login/register handle their own errors)
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/auth/')) {
        toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
);

export default apiClient;