import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '../types/auth.types';

/**
 * Authentication store state interface
 */
interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    
    // Actions
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    updateToken: (accessToken: string) => void;
    logout: () => void;
    initialize: () => void;
}

/**
 * Zustand authentication store
 * Manages global authentication state with persistence to cookies
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,

        /**
         * Set authentication data after login/register
         */
        setAuth: (user, accessToken, refreshToken) => {
            // Store tokens in cookies (more secure than localStorage)
            Cookies.set('accessToken', accessToken, { expires: 7 }); // 7 days
            Cookies.set('refreshToken', refreshToken, { expires: 30 }); // 30 days
            
            set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            });
        },

        /**
         * Update user information
         */
        setUser: (user) => {
            set({ user });
        },

        /**
         * Update access token (after refresh)
         */
        updateToken: (accessToken) => {
            Cookies.set('accessToken', accessToken, { expires: 7 });
            set({ accessToken });
        },

        /**
         * Logout user and clear all auth data
         */
        logout: () => {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            
            set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            });
        },

        /**
         * Initialize auth state from cookies (on app load)
         */
        initialize: () => {
            const accessToken = Cookies.get('accessToken');
            const refreshToken = Cookies.get('refreshToken');
            const userStr = Cookies.get('user');

            if (accessToken && refreshToken && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
                });
            } catch {
                // Invalid user data, clear everything
                get().logout();
            }
            } else {
            set({ isLoading: false });
            }
        },
        }),
        {
        name: 'auth-storage',
        // Only persist user data, not tokens (tokens are in cookies)
        partialize: (state) => ({ user: state.user }),
        }
    )
);

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
    return useAuthStore((state) => state.isAuthenticated);
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
    return useAuthStore((state) => state.user);
};