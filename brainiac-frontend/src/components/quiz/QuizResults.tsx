'use client';

import React from 'react';
import { CheckCircle2, XCircle, RotateCcw, Home, Trophy, Target, Clock } from 'lucide-react';
import { Quiz, AttemptAnswer } from '@/lib/types/quiz.types';

interface QuizResultsProps {
    quiz: Quiz;
    answers: AttemptAnswer[];
    durationSecs: number;
    onRetry: () => void;
    onHome: () => void;
}

/**
 * Full-page results screen shown after quiz completion.
 * Displays: score ring, stats, per-question breakdown.
 */
export default function QuizResults({ quiz, answers, durationSecs, onRetry, onHome }: QuizResultsProps) {
    const correct  = answers.filter(a => a.isCorrect).length;
    const total    = quiz.questions.length;
    const pct      = Math.round((correct / total) * 100);
    const earned   = answers
        .filter(a => a.isCorrect)
        .reduce((s, a) => s + quiz.questions[a.questionIndex].points, 0);

    const mins = Math.floor(durationSecs / 60);
    const secs = durationSecs % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    const grade =
        pct >= 80 ? { label: 'Excellent!',  emoji: '🏆', color: 'text-emerald-600', ring: '#10b981' } :
        pct >= 60 ? { label: 'Good job!',   emoji: '🎯', color: 'text-amber-600',   ring: '#f59e0b' } :
                    { label: 'Keep going!', emoji: '💪', color: 'text-red-500',     ring: '#ef4444' };

    const r     = 44;
    const circ  = 2 * Math.PI * r;
    const offset = circ * (1 - pct / 100);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-md space-y-4">

            {/* Score card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div
                className="h-1.5"
                style={{ background: `linear-gradient(to right, ${grade.ring}, ${grade.ring}88)` }}
            />
            <div className="p-7 text-center">
                <div className="text-5xl mb-2">{grade.emoji}</div>
                <h1 className={`text-2xl font-black mb-0.5 ${grade.color}`}>{grade.label}</h1>
                <p className="text-xs text-gray-400 mb-6 truncate">{quiz.title}</p>

                {/* Circle ring */}
                <div className="relative w-36 h-36 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" />
                    <circle
                    cx="50" cy="50" r={r} fill="none"
                    stroke={grade.ring}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900">{pct}%</span>
                    <span className="text-[10px] text-gray-400 font-medium">Score</span>
                </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                {[
                    { icon: <Trophy size={14} />, value: `${earned} pts`, label: 'Earned',   color: 'text-amber-500' },
                    { icon: <Target size={14} />,  value: `${correct}/${total}`, label: 'Correct',  color: 'text-indigo-500' },
                    { icon: <Clock size={14} />,   value: timeStr,  label: 'Duration', color: 'text-emerald-500' },
                ].map(({ icon, value, label, color }) => (
                    <div key={label} className="p-3 rounded-2xl bg-gray-50 flex flex-col items-center gap-1">
                    <span className={color}>{icon}</span>
                    <span className="text-sm font-bold text-gray-900">{value}</span>
                    <span className="text-[10px] text-gray-400">{label}</span>
                    </div>
                ))}
                </div>
            </div>
            </div>

            {/* Per-question breakdown */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Question Breakdown
                </h3>
                <div className="space-y-2">
                {answers.map((a, i) => (
                    <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                        a.isCorrect ? 'bg-emerald-50' : 'bg-red-50'
                    }`}
                    >
                    {a.isCorrect
                        ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        : <XCircle     size={15} className="text-red-400    shrink-0" />
                    }
                    <p className="text-xs text-gray-600 flex-1 line-clamp-1">
                        Q{i + 1}: {quiz.questions[i].questionText}
                    </p>
                    <span className={`text-xs font-bold shrink-0 ${a.isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                        {a.isCorrect ? `+${quiz.questions[i].points}` : '0'}
                    </span>
                    </div>
                ))}
                </div>
            </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pb-4">
            <button
                onClick={onHome}
                className="flex-1 h-12 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
                <Home size={14} /> Dashboard
            </button>
            <button
                onClick={onRetry}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
                <RotateCcw size={14} /> Try Again
            </button>
            </div>
        </div>
        </div>
    );
}
