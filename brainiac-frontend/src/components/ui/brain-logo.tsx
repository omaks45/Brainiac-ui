import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BrainLogoProps {
    className?: string;
    size?: number;
}

/**
 * Brain Logo Component
 * Represents intelligence and knowledge for the Brainiac brand
 */
export const BrainLogo: React.FC<BrainLogoProps> = ({ className, size = 24 }) => {
    return (
        <svg
        className={cn('text-white', className)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        {/* Brain outline */}
        <path d="M9.5 2a2.5 2.5 0 0 1 5 0c.706 0 1.388.18 1.987.506.6.327 1.12.794 1.51 1.359.39.565.662 1.21.786 1.879.124.67.089 1.354-.103 2.005a4.5 4.5 0 0 1-.786 1.879 4.5 4.5 0 0 1-1.51 1.359c-.6.327-1.281.506-1.987.506" />
        <path d="M14.5 7.5c.706 0 1.388.18 1.987.506.6.327 1.12.794 1.51 1.359.39.565.662 1.21.786 1.879.124.67.089 1.354-.103 2.005a4.5 4.5 0 0 1-.786 1.879 4.5 4.5 0 0 1-1.51 1.359c-.6.327-1.281.506-1.987.506" />
        <path d="M9.5 2c-.706 0-1.388.18-1.987.506-.6.327-1.12.794-1.51 1.359-.39.565-.662 1.21-.786 1.879-.124.67-.089 1.354.103 2.005a4.5 4.5 0 0 0 .786 1.879 4.5 4.5 0 0 0 1.51 1.359c.6.327 1.281.506 1.987.506" />
        <path d="M9.5 7.5c-.706 0-1.388.18-1.987.506-.6.327-1.12.794-1.51 1.359-.39.565-.662 1.21-.786 1.879-.124.67-.089 1.354.103 2.005a4.5 4.5 0 0 0 .786 1.879 4.5 4.5 0 0 0 1.51 1.359c.6.327 1.281.506 1.987.506" />
        {/* Neural connections */}
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="9" cy="9" r="0.8" fill="currentColor" />
        <circle cx="15" cy="9" r="0.8" fill="currentColor" />
        <circle cx="9" cy="15" r="0.8" fill="currentColor" />
        <circle cx="15" cy="15" r="0.8" fill="currentColor" />
        </svg>
    );
};

/**
 * Simplified lightbulb brain icon (alternative)
 */
export const SimpleBrainLogo: React.FC<BrainLogoProps> = ({ className, size = 24 }) => {
    return (
        <svg
        className={cn('text-white', className)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    );
};