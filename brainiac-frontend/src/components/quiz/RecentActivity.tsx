'use client';

import React from 'react';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Clock, CheckCircle2, XCircle, Trophy, ChevronRight, BookOpen } from 'lucide-react';
import { useMyAttempts } from '@/lib/hooks/use-quiz';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/types/quiz.types';

// Helpers 

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

interface AttemptWithQuiz {
    quizId: string;
    percentage: number;
    score: number;
    completedAt: string;
    quiz?: {
        title?: string;
        category?: string;
        difficulty?: string;
    };
}

//  Single attempt row 

function AttemptRow({ attempt }: { attempt: AttemptWithQuiz }) {
    const quiz     = attempt.quiz;
    const catMeta  = CATEGORY_META.find(c => c.id === quiz?.category);
    const diffMeta = DIFFICULTY_META[quiz?.difficulty as keyof typeof DIFFICULTY_META];
    const passed   = attempt.percentage >= 60;

    return (
        <Link
        href={`/quiz-session/${attempt.quizId}`}
        className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
        >
        {/* Category dot + icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'} flex items-center justify-center shrink-0`}>
            <BookOpen size={14} className="text-white" />
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
            {quiz?.title ?? 'Quiz Attempt'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
            {catMeta && (
                <span className="text-[10px] text-gray-400">{catMeta.label}</span>
            )}
            {diffMeta && (
                <>
                <span className="text-gray-300">·</span>
                <span className={`text-[10px] font-semibold ${diffMeta.color}`}>{diffMeta.label}</span>
                </>
            )}
            <span className="text-gray-300">·</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Clock size={9} /> {timeAgo(attempt.completedAt)}
            </span>
            </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span className={`text-sm font-black ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
            {attempt.percentage}%
            </span>
            <div className="flex items-center gap-1">
            {passed
                ? <CheckCircle2 size={11} className="text-emerald-500" />
                : <XCircle size={11} className="text-red-400" />
            }
            <span className="text-[10px] text-gray-400">{attempt.score} pts</span>
            </div>
        </div>

        <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
    );
}

//  Empty state

function EmptyActivity() {
    return (
        <div className="flex flex-col items-center py-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Clock size={20} className="text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-500 mb-1">No activity yet</p>
        <p className="text-xs text-gray-400">Start taking quizzes to see your activity here</p>
        </div>
    );
}

//  Skeleton 

function ActivitySkeleton() {
    return (
        <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5 p-3.5 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-10" />
            </div>
        ))}
        </div>
    );
}

// Main component 

export default function RecentActivity() {
    const { data, isLoading } = useMyAttempts(5);
    const attempts = data?.attempts ?? [];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-5 pb-3">
            <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
            </div>
            {attempts.length > 0 && (
            <Link
                href="/dashboard/quizzes"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
                View all <ChevronRight size={12} />
            </Link>
            )}
        </div>
        <p className="text-xs text-gray-400 px-5 mb-2">Your latest quiz attempts and achievements</p>

        <div className="px-2 pb-3">
            {isLoading ? (
            <ActivitySkeleton />
            ) : attempts.length === 0 ? (
            <EmptyActivity />
            ) : (
            <div className="divide-y divide-gray-100">
                {attempts.map(attempt => (
                <AttemptRow key={attempt._id} attempt={attempt} />
                ))}
            </div>
            )}
        </div>
        </div>
    );
}
