/**
 * quiz.types.ts
 * Defines TypeScript types and interfaces for quizzes, quiz attempts, and related data structures.
 * This file centralizes all quiz-related types for consistent use across the frontend application.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizCategory =
    | 'software_engineering'
    | 'mathematics'
    | 'product_design'
    | 'data_science'
    | 'data_analytics'
    | 'biological_science'
    | 'art_humanities'
    | 'economics';

export interface QuizQuestion {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    points: number;
    timeLimit: number; // seconds
}

export interface QuizMetadata {
    timesAttempted: number;
    averageScore: number;
    aiModel: string;
    generationDate: string;
    _id: string;
}

export interface Quiz {
    _id: string;
    title: string;
    category: QuizCategory;
    difficulty: Difficulty;
    questions: QuizQuestion[];
    totalPoints: number;
    estimatedDuration: number; // minutes
    createdBy: string; // 'ai' | userId
    isPublic: boolean;
    tags: string[];
    metadata: QuizMetadata;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// ─── Request / Response DTOs ───

export interface GenerateQuizRequest {
    category: QuizCategory;
    difficulty: Difficulty;
    numberOfQuestions: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GenerateQuizResponse extends Quiz {}

// ─── Quiz Attempt ──

export interface QuizAnswerPayload {
    questionIndex: number;
    selectedAnswer: number; // -1 = timed out
}

export interface SubmitQuizRequest {
    quizId: string;
    answers: QuizAnswerPayload[];
    duration: number; // seconds
}

export interface AttemptAnswer {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
}

export interface QuizAttempt {
    _id: string;
    userId: string;
    quizId: string;
    quiz?: Quiz; // populated
    answers: AttemptAnswer[];
    score: number;
    percentage: number;
    completedAt: string;
    duration: number;
}

// ─── UI State ──

export interface QuizSessionState {
    quiz: Quiz | null;
    currentIndex: number;
    answers: AttemptAnswer[];
    startTime: number;
    questionStartTime: number;
    status: 'idle' | 'active' | 'reviewing' | 'finished';
}

// ─── Category metadata (display) 

export interface CategoryMeta {
    id: QuizCategory;
    label: string;
    color: string;        // hex
    gradient: string;     // tailwind classes
    bgClass: string;      // tailwind bg
    quizCount?: number;
}

export const CATEGORY_META: CategoryMeta[] = [
    { id: 'software_engineering', label: 'Software Engineering', color: '#6366f1', gradient: 'from-indigo-500 to-violet-600',  bgClass: 'bg-indigo-500' },
    { id: 'mathematics',          label: 'Mathematics',          color: '#f59e0b', gradient: 'from-amber-400 to-orange-500',   bgClass: 'bg-amber-400' },
    { id: 'product_design',       label: 'Product Design',       color: '#10b981', gradient: 'from-emerald-400 to-teal-500',   bgClass: 'bg-emerald-400' },
    { id: 'data_science',         label: 'Data Science',         color: '#3b82f6', gradient: 'from-blue-400 to-cyan-500',      bgClass: 'bg-blue-400' },
    { id: 'data_analytics',       label: 'Data Analytics',       color: '#8b5cf6', gradient: 'from-violet-400 to-purple-600',  bgClass: 'bg-violet-500' },
    { id: 'biological_science',   label: 'Biological Science',   color: '#ef4444', gradient: 'from-red-400 to-rose-500',       bgClass: 'bg-red-400' },
    { id: 'art_humanities',       label: 'Art & Humanities',     color: '#ec4899', gradient: 'from-pink-400 to-fuchsia-500',   bgClass: 'bg-pink-400' },
    { id: 'economics',            label: 'Economics & Social',   color: '#f97316', gradient: 'from-orange-400 to-amber-500',   bgClass: 'bg-orange-400' },
];

export const DIFFICULTY_META = {
    easy:   { label: 'Easy',   color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', dot: 'bg-emerald-400' },
    medium: { label: 'Medium', color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   dot: 'bg-amber-400'   },
    hard:   { label: 'Hard',   color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     dot: 'bg-red-400'     },
} as const;