/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, BookOpen, Clock, BarChart2, Trophy,
    Sparkles, CheckCircle2, Play, Loader2, AlertCircle,
} from 'lucide-react';
import { useQuiz } from '@/lib/hooks/use-quiz';
import { useQuizSession } from '@/lib/store/quiz-store';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/types/quiz.types';

export default function QuizDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;

    const { data: quiz, isLoading, isError } = useQuiz(quizId);
    const { startQuiz } = useQuizSession();

    const handleStart = () => {
        if (!quiz) return;
        startQuiz(quiz);
        router.push(`/quiz-session/${quiz._id}`);
    };

    if (isLoading) {
        return (
        <div className="max-w-2xl mx-auto px-4 py-10 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
        </div>
        );
    }

    if (isError || !quiz) {
        return (
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
            <AlertCircle size={28} className="text-red-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Quiz not found.</p>
            <Link href="/dashboard/quizzes" className="mt-4 inline-block text-sm text-indigo-600 font-semibold">
            ← Back to quizzes
            </Link>
        </div>
        );
    }

    const catMeta  = CATEGORY_META.find(c => c.id === quiz.category);
    const diffMeta = DIFFICULTY_META[quiz.difficulty];

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 font-medium"
        >
            <ArrowLeft size={15} /> Back to Quizzes
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className={`h-1.5 bg-gradient-to-r ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'}`} />
            <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'} flex items-center justify-center shadow-md shrink-0`}>
                <BookOpen size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-gray-900 leading-tight mb-1">{quiz.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${diffMeta.color} ${diffMeta.bg} ${diffMeta.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
                    {diffMeta.label}
                    </span>
                    {catMeta && (
                    <span className="text-xs text-gray-400">{catMeta.label}</span>
                    )}
                    {quiz.createdBy === 'ai' && (
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-500 font-semibold">
                        <Sparkles size={10} /> AI Generated
                    </span>
                    )}
                </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                { icon: <BookOpen size={14} />, value: `${quiz.questions.length}`, label: 'Questions' },
                { icon: <Clock size={14} />,    value: `~${quiz.estimatedDuration}m`, label: 'Duration' },
                { icon: <Trophy size={14} />,   value: `${quiz.totalPoints}`,     label: 'Total Pts'  },
                ].map(({ icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-gray-50">
                    <span className="text-gray-400">{icon}</span>
                    <span className="text-base font-black text-gray-900">{value}</span>
                    <span className="text-[10px] text-gray-400">{label}</span>
                </div>
                ))}
            </div>

            <button
                onClick={handleStart}
                className={`w-full h-12 rounded-2xl font-bold text-white bg-gradient-to-r ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'} flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
            >
                <Play size={16} /> Start Quiz
            </button>
            </div>
        </div>

        {/* Question preview */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Questions Preview
            </h2>
            <div className="space-y-2">
            {quiz.questions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'}`}>
                    {i + 1}
                </span>
                <p className="text-xs text-gray-600 leading-snug flex-1 line-clamp-2">{q.questionText}</p>
                <div className="flex items-center gap-1 shrink-0">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">{q.timeLimit}s</span>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}
