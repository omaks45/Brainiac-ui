/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Sparkles, BookOpen, Clock, BarChart2, Filter, Search,
    ChevronRight, Loader2, AlertCircle,
} from 'lucide-react';
import { useQuizzes } from '@/lib/hooks/use-quiz';
import { useQuizSession } from '@/lib/store/quiz-store';
import { Quiz, QuizCategory, Difficulty, CATEGORY_META, DIFFICULTY_META } from '@/lib/types/quiz.types';
import GenerateQuizModal from '@/components/quiz/GenerateQuizModal';

// Quiz card 

function QuizCard({ quiz }: { quiz: Quiz }) {
    const router = useRouter();
    const { startQuiz } = useQuizSession();

    const catMeta  = CATEGORY_META.find(c => c.id === quiz.category);
    const diffMeta = DIFFICULTY_META[quiz.difficulty];

    const handleStart = () => {
        startQuiz(quiz);
        router.push(`/quiz-session/${quiz._id}`);
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
        {/* Category gradient strip */}
        <div className={`h-1 bg-gradient-to-r ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'}`} />

        <div className="p-5">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'} flex items-center justify-center shrink-0`}>
                <BookOpen size={14} className="text-white" />
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffMeta.color} ${diffMeta.bg} ${diffMeta.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
                {diffMeta.label}
            </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
            {quiz.title}
            </h3>
            <p className="text-xs text-gray-400 mb-4">{catMeta?.label ?? quiz.category}</p>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4">
            <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {quiz.questions.length} questions
            </span>
            <span className="flex items-center gap-1">
                <Clock size={11} />
                ~{quiz.estimatedDuration}m
            </span>
            <span className="flex items-center gap-1">
                <BarChart2 size={11} />
                {quiz.totalPoints} pts
            </span>
            </div>

            <button
            onClick={handleStart}
            className={`w-full h-9 rounded-xl bg-gradient-to-r ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'} text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md transition-all active:scale-[0.98]`}
            >
            Start Quiz <ChevronRight size={13} />
            </button>
        </div>
        </div>
    );
}

//  Empty state 

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Sparkles size={22} className="text-indigo-400" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1">No quizzes yet</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-xs">
            Generate your first AI quiz to get started. Pick any category and difficulty.
        </p>
        <button
            onClick={onGenerate}
            className="h-10 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
        >
            <Sparkles size={14} /> Create AI Quiz
        </button>
        </div>
    );
}

//  Main page 

export default function QuizzesPage() {
    const [showModal, setShowModal]       = useState(false);
    const [searchQuery, setSearchQuery]   = useState('');
    const [categoryFilter, setCategoryFilter] = useState<QuizCategory | ''>('');
    const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('');

    const { data, isLoading, isError } = useQuizzes({
        category: categoryFilter || undefined,
        difficulty: difficultyFilter || undefined,
    });

    const quizzes: Quiz[] = data?.quizzes ?? [];

    const filtered = quizzes.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
            <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quizzes</h1>
            <p className="text-sm text-gray-400 mt-0.5">
                {quizzes.length > 0 ? `${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''} available` : 'Browse and take quizzes'}
            </p>
            </div>
            <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all whitespace-nowrap"
            >
            <Sparkles size={14} /> Create AI Quiz
            </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
            {/* Search */}
            <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search quizzes…"
                className="w-full h-10 pl-9 pr-4 rounded-xl border-2 border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 transition-colors bg-white"
            />
            </div>

            {/* Category filter */}
            <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as QuizCategory | '')}
            className="h-10 px-3 rounded-xl border-2 border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 transition-colors bg-white appearance-none cursor-pointer"
            >
            <option value="">All Categories</option>
            {CATEGORY_META.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
            ))}
            </select>

            {/* Difficulty filter */}
            <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value as Difficulty | '')}
            className="h-10 px-3 rounded-xl border-2 border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 transition-colors bg-white appearance-none cursor-pointer"
            >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            </select>
        </div>

        {/* Content */}
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 bg-white rounded-2xl animate-pulse border border-gray-200" />
            ))}
            </div>
        ) : isError ? (
            <div className="flex flex-col items-center py-16 text-center gap-3">
            <AlertCircle size={28} className="text-red-400" />
            <p className="text-sm text-gray-500">Failed to load quizzes. Please try again.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
                <EmptyState onGenerate={() => setShowModal(true)} />
            ) : (
                filtered.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)
            )}
            </div>
        )}

        {/* Generate Modal */}
        <GenerateQuizModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
