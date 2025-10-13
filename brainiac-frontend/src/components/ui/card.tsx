import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated' | 'glass';
}

/**
 * Card Component
 * Container component for grouping related content
 * glassmorphism and color scheme
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        return (
        <div
            ref={ref}
            className={cn(
            'rounded-2xl bg-white',
            variant === 'default' && 'border border-gray-200',
            variant === 'bordered' && 'border-2 border-gray-300',
            variant === 'elevated' && 'shadow-lg border border-gray-100',
            variant === 'glass' && 'glass border-white/40',
            className
            )}
            {...props}
        >
            {children}
        </div>
        );
    }
);

Card.displayName = 'Card';

/**
 * Card Header Component
 */
export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 pb-4', className)}
        {...props}
    />
));

CardHeader.displayName = 'CardHeader';

/**
 * Card Title Component
 */
export const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-2xl font-bold text-gray-900', className)}
        {...props}
    />
));

CardTitle.displayName = 'CardTitle';

/**
 * Card Description Component
 */
export const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-gray-600 mt-2', className)}
        {...props}
    />
));

CardDescription.displayName = 'CardDescription';

/**
 * Card Content Component
 */
export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
    />
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 */
export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 pt-0 flex items-center', className)}
        {...props}
    />
));

CardFooter.displayName = 'CardFooter';