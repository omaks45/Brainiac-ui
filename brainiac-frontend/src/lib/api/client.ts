import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

/**
 * Base API URL from environment variables
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', BASE_URL); // Debug log

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Set to true if backend requires credentials
});

/**
 * Request interceptor - Adds access token to all requests
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('accessToken');
        
        console.log('Request:', config.method?.toUpperCase(), config.url); // Debug log
        
        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error: AxiosError) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handles token refresh and errors
 */
apiClient.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.config.url); // Debug log
        return response;
    },
    async (error: AxiosError) => {
        console.error('Response Error:', error.response?.status, error.message);
        
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = Cookies.get('refreshToken');
            
            if (!refreshToken) {
            throw new Error('No refresh token available');
            }

            console.log('Attempting token refresh...');

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
            console.error('Token refresh failed:', refreshError);
            
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

        // Handle other errors with detailed messages
        let errorMessage = 'An error occurred';
        
        if (error.response) {
        // Server responded with error
        const data = error.response.data as unknown;
        if (typeof data === 'object' && data !== null) {
            const message = (data as { message?: string }).message;
            const errorText = (data as { error?: string }).error;
            errorMessage = message || errorText || `Error ${error.response.status}`;
        } else {
            errorMessage = `Error ${error.response.status}`;
        }
        
        console.error('Server Error:', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
        });
        } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check if backend is running.';
        console.error('Network Error:', {
            message: error.message,
            url: error.config?.url,
            baseURL: BASE_URL,
        });
        } else {
        // Something else happened
        errorMessage = error.message || 'Request failed';
        }

        // Don't show toast for auth pages (they handle their own errors)
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/auth/')) {
        toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
);

export default apiClient;