'use client';

import React, { useState } from 'react';
import {
    X, Sparkles, Loader2,
    Code2, Calculator, Palette, BarChart3, TrendingUp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    FlaskConical, Atom, Music, BookOpen,
} from 'lucide-react';
import { useGenerateQuiz } from '@/lib/hooks/use-quiz';
import { QuizCategory, Difficulty, CATEGORY_META, DIFFICULTY_META } from '@/lib/types/quiz.types';

//Types 

interface GenerateQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormState {
    category: QuizCategory | '';
    difficulty: Difficulty;
    numberOfQuestions: number;
}

//Category icons map 

const CATEGORY_ICONS: Record<QuizCategory, React.ReactNode> = {
    software_engineering: <Code2 size={15} />,
    mathematics:          <Calculator size={15} />,
    product_design:       <Palette size={15} />,
    data_science:         <BarChart3 size={15} />,
    data_analytics:       <TrendingUp size={15} />,
    biological_science:   <FlaskConical size={15} />,
    art_humanities:       <Music size={15} />,
    economics:            <BookOpen size={15} />,
};

const QUESTION_COUNTS = [5, 10, 15, 20];

// Step indicator 

function StepDots({ step }: { step: number }) {
    return (
        <div className="flex items-center gap-1.5 mb-5">
        {[0, 1].map(i => (
            <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-indigo-500' : i < step ? 'w-6 bg-indigo-300' : 'w-3 bg-gray-200'
            }`}
            />
        ))}
        <span className="ml-1 text-[11px] text-gray-400 font-medium">Step {step + 1} of 2</span>
        </div>
    );
}

// Main component 

export default function GenerateQuizModal({ isOpen, onClose }: GenerateQuizModalProps) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormState>({
        category: '',
        difficulty: 'medium',
        numberOfQuestions: 5,
    });

    const { mutate: generateQuiz, isPending } = useGenerateQuiz();

    const selectedMeta = CATEGORY_META.find(c => c.id === form.category);

    const handleGenerate = () => {
        if (!form.category) return;
        generateQuiz({
        category: form.category as QuizCategory,
        difficulty: form.difficulty,
        numberOfQuestions: form.numberOfQuestions,
        });
    };

    const handleClose = () => {
        if (isPending) return;
        setStep(0);
        setForm({ category: '', difficulty: 'medium', numberOfQuestions: 5 });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Top accent bar — changes color with category */}
            <div
            className={`h-1 w-full bg-gradient-to-r transition-all duration-500 ${
                selectedMeta?.gradient ?? 'from-indigo-500 via-violet-500 to-purple-600'
            }`}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selectedMeta?.gradient ?? 'from-indigo-500 to-violet-600'} flex items-center justify-center shadow-md transition-all duration-500`}>
                <Sparkles size={16} className="text-white" />
                </div>
                <div>
                <h2 className="text-lg font-bold text-gray-900">Create AI Quiz</h2>
                <p className="text-[11px] text-gray-400">Powered by Gemini Flash</p>
                </div>
            </div>
            <button
                onClick={handleClose}
                disabled={isPending}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-40"
            >
                <X size={16} />
            </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
            <StepDots step={step} />

            {/*  Step 0: Category  */}
            {step === 0 && (
                <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Choose a category</p>
                <p className="text-xs text-gray-400 mb-4">What subject do you want to be tested on?</p>
                <div className="grid grid-cols-3 gap-2">
                    {CATEGORY_META.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                        className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center transition-all duration-200 ${
                        form.category === cat.id
                            ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-sm`}>
                        {CATEGORY_ICONS[cat.id]}
                        </div>
                        <span className={`text-[11px] font-semibold leading-tight ${
                        form.category === cat.id ? 'text-indigo-700' : 'text-gray-600'
                        }`}>
                        {cat.label}
                        </span>
                        {form.category === cat.id && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                        )}
                    </button>
                    ))}
                </div>

                <button
                    disabled={!form.category}
                    onClick={() => setStep(1)}
                    className={`mt-5 w-full h-11 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    form.category
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:shadow-indigo-200/60 hover:shadow-xl active:scale-[0.98]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Continue →
                </button>
                </div>
            )}

            {/* ── Step 1: Difficulty + Count ── */}
            {step === 1 && (
                <div>
                {/* Category recap pill */}
                {selectedMeta && (
                    <button
                    onClick={() => setStep(0)}
                    className={`mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${selectedMeta.gradient} text-white text-xs font-semibold`}
                    >
                    {CATEGORY_ICONS[selectedMeta.id]}
                    {selectedMeta.label}
                    <span className="opacity-70 ml-0.5">· Change</span>
                    </button>
                )}

                {/* Difficulty */}
                <p className="text-xs font-semibold text-gray-700 mb-2">Difficulty level</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                    {(Object.entries(DIFFICULTY_META) as [Difficulty, typeof DIFFICULTY_META[Difficulty]][]).map(([key, meta]) => (
                    <button
                        key={key}
                        onClick={() => setForm(f => ({ ...f, difficulty: key }))}
                        className={`flex flex-col items-center gap-0.5 p-3 rounded-2xl border-2 text-center transition-all duration-200 ${
                        form.difficulty === key
                            ? `${meta.border} ${meta.bg} ${meta.color} shadow-sm`
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-sm font-bold">{meta.label}</span>
                        <span className={`text-[10px] font-medium`}>
                        {key === 'easy' ? 'Fundamentals' : key === 'medium' ? 'Applied' : 'Expert'}
                        </span>
                    </button>
                    ))}
                </div>

                {/* Question count */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-700">Number of questions</p>
                    <span className="text-xs font-bold text-indigo-600">{form.numberOfQuestions} questions</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-1">
                    {QUESTION_COUNTS.map(n => (
                    <button
                        key={n}
                        onClick={() => setForm(f => ({ ...f, numberOfQuestions: n }))}
                        className={`h-11 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                        form.numberOfQuestions === n
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {n}
                    </button>
                    ))}
                </div>
                <p className="text-[10px] text-gray-400 text-center mb-4">
                    ⏱ ~{Math.ceil(form.numberOfQuestions * 0.75)} min estimated
                </p>

                {/* Summary */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quiz Summary</p>
                    {[
                    ['Category', selectedMeta?.label],
                    ['Difficulty', form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1)],
                    ['Questions', `${form.numberOfQuestions} questions`],
                    ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-0.5">
                        <span className="text-xs text-gray-500">{label}</span>
                        <span className="text-xs font-semibold text-gray-800">{value}</span>
                    </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                    <button
                    onClick={() => setStep(0)}
                    disabled={isPending}
                    className="h-11 px-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
                    >
                    Back
                    </button>
                    <button
                    onClick={handleGenerate}
                    disabled={isPending}
                    className={`flex-1 h-11 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${
                        selectedMeta?.gradient ?? 'from-indigo-500 to-violet-600'
                    } text-white shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100`}
                    >
                    {isPending ? (
                        <><Loader2 size={15} className="animate-spin" /> Generating…</>
                    ) : (
                        <><Sparkles size={15} /> Generate Quiz</>
                    )}
                    </button>
                </div>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
