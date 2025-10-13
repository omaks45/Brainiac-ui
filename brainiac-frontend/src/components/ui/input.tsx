import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Input Component
 * Reusable form input with label, error message, and icon support
 * Updated with new Electric Blue color scheme
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, type = 'text', ...props }, ref) => {
        const inputId = React.useId();

        return (
        <div className="w-full">
            {label && (
            <label
                htmlFor={inputId}
                className="block text-sm font-semibold text-gray-700 mb-2"
            >
                {label}
            </label>
            )}
            
            <div className="relative">
            {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {leftIcon}
                </div>
            )}
            
            <input
                id={inputId}
                ref={ref}
                type={type}
                className={cn(
                'w-full h-12 px-4 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                'hover:border-gray-400',
                error
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300',
                leftIcon && 'pl-11',
                rightIcon && 'pr-11',
                props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
                className
                )}
                {...props}
            />
            
            {rightIcon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {rightIcon}
                </div>
            )}
            </div>
            
            {error && (
            <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </p>
            )}
        </div>
        );
    }
);

Input.displayName = 'Input';