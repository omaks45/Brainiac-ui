'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, XCircle, ChevronRight, Trophy, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import QuizTimer from '@/components/quiz/QuizTimer';
import QuizResults from '@/components/quiz/QuizResults';
import { useQuizSessionLogic } from '@/lib/hooks/use-quiz';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/types/quiz.types';

const LETTERS = ['A', 'B', 'C', 'D'];

// Loading skeleton 

function QuizSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
        <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />
        <div className="max-w-2xl mx-auto p-4 space-y-4 mt-4">
            <div className="h-40 bg-white rounded-3xl animate-pulse" />
            <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-14 bg-white rounded-2xl animate-pulse" />
            ))}
            </div>
        </div>
        </div>
    );
}

// Main Page 

export default function QuizSessionPage() {
    const params  = useParams();
    const quizId  = params.id as string;

    const {
        quiz,
        isLoading,
        currentIndex,
        answers,
        selectedAnswer,
        showExplanation,
        status,
        startTime,
        initSession,
        handleSelectAnswer,
        handleTimeExpire,
        handleNext,
        handleRetry,
        handleGoHome,
    } = useQuizSessionLogic(quizId);

    // Initialise session when quiz data arrives
    useEffect(() => {
        initSession();
    }, [initSession]);

    if (isLoading || !quiz) return <QuizSkeleton />;

    // ── Finished ──
    if (status === 'finished') {
        const durationSecs = Math.round((Date.now() - startTime) / 1000);
        return (
        <QuizResults
            quiz={quiz}
            answers={answers}
            durationSecs={durationSecs}
            onRetry={handleRetry}
            onHome={handleGoHome}
        />
        );
    }

    const question    = quiz.questions[currentIndex];
    const catMeta     = CATEGORY_META.find(c => c.id === quiz.category);
    const diffMeta    = DIFFICULTY_META[quiz.difficulty];
    const earnedPts   = answers.filter(a => a.isCorrect).reduce((s, a) => s + quiz.questions[a.questionIndex].points, 0);
    const progressPct = (currentIndex / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Sticky header ── */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link
                href="/dashboard/home"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft size={16} />
            </Link>

            {/* Progress bar */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                {currentIndex + 1}/{quiz.questions.length}
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'} transition-all duration-500`}
                    style={{ width: `${progressPct}%` }}
                />
                </div>
            </div>

            {/* Live points */}
            <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 whitespace-nowrap">
                <Zap size={13} />
                {earnedPts} pts
            </div>

            {/* Difficulty */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${diffMeta?.color} ${diffMeta?.bg} ${diffMeta?.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diffMeta?.dot}`} />
                {diffMeta?.label}
            </span>
            </div>

            {/* Thin accent line under header */}
            <div className={`h-0.5 bg-gradient-to-r ${catMeta?.gradient ?? 'from-indigo-500 to-violet-600'}`} />
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">

            {/* Question card */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-5 mb-4">
            <div className="flex items-start gap-4">
                <QuizTimer
                duration={question.timeLimit}
                onExpire={handleTimeExpire}
                paused={selectedAnswer !== null}
                size={54}
                />
                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {catMeta && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-white bg-gradient-to-r ${catMeta.gradient}`}>
                        {catMeta.label}
                    </span>
                    )}
                    <span className="text-[11px] font-semibold text-gray-400">{question.points} pts</span>
                </div>
                <p className="text-gray-900 font-semibold text-base leading-snug">
                    {question.questionText}
                </p>
                </div>
            </div>
            </div>

            {/* Answer options */}
            <div className="space-y-2.5 mb-4">
            {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect  = idx === question.correctAnswerIndex;
                const revealed   = selectedAnswer !== null;

                let cardCls = 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer';
                if (revealed) {
                if (isCorrect)                cardCls = 'border-emerald-400 bg-emerald-50 cursor-default';
                else if (isSelected)          cardCls = 'border-red-400 bg-red-50 cursor-default';
                else                          cardCls = 'border-gray-200 bg-gray-50 opacity-55 cursor-default';
                }

                let letterCls = 'bg-gray-100 text-gray-500';
                if (revealed && isCorrect)          letterCls = 'bg-emerald-500 text-white';
                else if (revealed && isSelected)    letterCls = 'bg-red-400 text-white';

                return (
                <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={revealed}
                    className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${cardCls}`}
                >
                    <span className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 transition-colors ${letterCls}`}>
                    {LETTERS[idx]}
                    </span>
                    <span className={`flex-1 text-sm font-medium leading-snug ${
                    revealed && isCorrect ? 'text-emerald-800' :
                    revealed && isSelected ? 'text-red-700' :
                    'text-gray-700'
                    }`}>
                    {option}
                    </span>
                    {revealed && isCorrect && <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />}
                    {revealed && isSelected && !isCorrect && <XCircle size={17} className="text-red-400 shrink-0" />}
                </button>
                );
            })}
            </div>

            {/* Explanation */}
            {showExplanation && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-4">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
                Explanation
                </p>
                <p className="text-sm text-indigo-900 leading-relaxed">
                {question.explanation}
                </p>
            </div>
            )}

            {/* Next / Finish button */}
            {selectedAnswer !== null && (
            <button
                onClick={handleNext}
                className={`w-full h-12 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all bg-gradient-to-r ${
                catMeta?.gradient ?? 'from-indigo-500 to-violet-600'
                }`}
            >
                {currentIndex + 1 >= quiz.questions.length ? (
                <><Trophy size={15} /> See Results</>
                ) : (
                <>Next Question <ChevronRight size={15} /></>
                )}
            </button>
            )}
        </main>
        </div>
    );
}
