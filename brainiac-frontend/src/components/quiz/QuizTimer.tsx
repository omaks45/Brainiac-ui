'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface QuizTimerProps {
    duration: number;       // seconds
    onExpire: () => void;
    paused?: boolean;
    size?: number;
}

/**
 * Circular SVG countdown timer.
 * Changes color: indigo → amber → red as time runs low.
 */
export default function QuizTimer({ duration, onExpire, paused = false, size = 56 }: QuizTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    // Reset when question changes (duration prop changes)
    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    const handleExpire = useCallback(() => onExpire(), [onExpire]);

    useEffect(() => {
        if (paused || timeLeft <= 0) {
        if (timeLeft <= 0) handleExpire();
        return;
        }
        const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, paused, handleExpire]);

    const pct    = timeLeft / duration;
    const r      = (size / 2) - 5;
    const circ   = 2 * Math.PI * r;
    const offset = circ * (1 - pct);

    const color =
        timeLeft > duration * 0.4 ? '#6366f1' :   // indigo
        timeLeft > duration * 0.2 ? '#f59e0b' :   // amber
        '#ef4444';                                 // red

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
        >
            {/* Track */}
            <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="4"
            />
            {/* Progress */}
            <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
            />
        </svg>
        {/* Label */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span
            className="text-xs font-black tabular-nums"
            style={{ color }}
            >
            {timeLeft}s
            </span>
        </div>
        </div>
    );
}
