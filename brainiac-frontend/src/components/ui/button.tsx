import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Button variants using CVA (Class Variance Authority)
 * Defines different button styles and sizes
 * Electric Blue & Purple color scheme
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
    {
        variants: {
        variant: {
            primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus-visible:ring-primary-500 shadow-lg hover:shadow-glow',
            secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus-visible:ring-secondary-500 shadow-lg hover:shadow-glow-purple',
            accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus-visible:ring-accent-500 shadow-lg hover:shadow-glow-cyan',
            outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 focus-visible:ring-primary-500',
            ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus-visible:ring-red-500 shadow-lg',
            success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus-visible:ring-emerald-500 shadow-lg',
        },
        size: {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-12 px-8 text-lg',
            xl: 'h-14 px-10 text-xl',
            icon: 'h-10 w-10',
        },
        fullWidth: {
            true: 'w-full',
        },
        },
        defaultVariants: {
        variant: 'primary',
        size: 'md',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * Reusable button with multiple variants, sizes, and loading state
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
        className,
        variant,
        size,
        fullWidth,
        isLoading,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
        },
        ref
    ) => {
        return (
        <button
            className={cn(buttonVariants({ variant, size, fullWidth, className }))}
            ref={ref}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
            </>
            ) : (
            <>
                {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
            </>
            )}
        </button>
    );
});

Button.displayName = 'Button';