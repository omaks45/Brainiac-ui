//  Quiz Types — matches backend MongoDB schema exactly 

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizCategory =
    | 'software-engineering'
    | 'mathematics'
    | 'product-design'
    | 'data-science'
    | 'data-analytics'
    | 'social-science'
    | 'art-humanities'
    | 'economics';

export interface QuizQuestion {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    points: number;
    timeLimit: number;
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
    estimatedDuration: number;
    createdBy: string;
    isPublic: boolean;
    tags: string[];
    metadata: QuizMetadata;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

//  Request DTOs 

export type GenerateQuizRequest = {
    category: QuizCategory;
    difficulty: Difficulty;
    numberOfQuestions: number;
};

export type GenerateQuizResponse = Quiz;

/**
 * Mirrors backend SubmitAnswerDto:
 *   questionIndex  @Min(0)
 *   selectedAnswer @Min(0) @Max(3)
 *   timeSpent      @Min(0)
 */
export interface QuizAnswerPayload {
    questionIndex: number;
    selectedAnswer: number; // 0–3, never -1
    timeSpent: number;      // seconds >= 0
}

/**
 * Mirrors backend SubmitQuizDto:
 *   quizId  @IsMongoId
 *   answers @IsArray @ArrayMinSize(1) @ValidateNested
 */
export interface SubmitQuizRequest {
    quizId: string;
    answers: QuizAnswerPayload[];
}

// Response DTOs 

/** Mirrors backend AnswerResultDto */
export interface AnswerResult {
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
    pointsEarned: number;
    timeSpent: number;
}

/**
 * Shape of quizId when backend uses .populate('quizId', 'title category difficulty totalPoints').
 * The quizId field in QuizAttempt becomes this object instead of a plain string.
 */
export interface PopulatedQuiz {
    _id: string;
    title: string;
    category: string;
    difficulty: string;
    totalPoints?: number;
}

/**
 * Mirrors backend AttemptResponseDto.
 * quizId is string | PopulatedQuiz because:
 *   - POST /api/quiz-attempts/submit → returns quizId as a string
 *   - GET  /api/quiz-attempts        → returns quizId as a populated object
 * Always extract the ID with resolveQuizId() before using in hrefs.
 */
export interface QuizAttempt {
    _id: string;
    quizId: string | PopulatedQuiz;
    quiz?: Quiz;
    score: number;
    percentage: number;
    totalQuestions: number;
    correctAnswers: number;
    duration: number;
    answers: AnswerResult[];
    completedAt: string;
}

/**
 * Mirrors GET /api/quiz-attempts/stats response exactly:
 * { totalAttempts, averageScore, averagePercentage,
 *   totalTimeSpent, bestScore, bestPercentage }
 */
export interface QuizStats {
    totalAttempts: number;
    averageScore: number;
    averagePercentage: number;
    totalTimeSpent: number;
    bestScore: number;
    bestPercentage: number;
}

//Internal UI session state (never sent to backend) 

export interface AttemptAnswer {
    questionIndex: number;
    selectedAnswer: number; // -1 internally = timed out
    isCorrect: boolean;
    timeSpent: number;
}

export interface QuizSessionState {
    quiz: Quiz | null;
    currentIndex: number;
    answers: AttemptAnswer[];
    startTime: number;
    questionStartTime: number;
    status: 'idle' | 'active' | 'reviewing' | 'finished';
}

// Display metadata 

export interface CategoryMeta {
    id: QuizCategory;
    label: string;
    color: string;
    gradient: string;
    bgClass: string;
    quizCount?: number;
}

export const CATEGORY_META: CategoryMeta[] = [
    { id: 'software-engineering', label: 'Software Engineering', color: '#6366f1', gradient: 'from-indigo-500 to-violet-600',  bgClass: 'bg-indigo-500'  },
    { id: 'mathematics',          label: 'Mathematics',          color: '#f59e0b', gradient: 'from-amber-400 to-orange-500',   bgClass: 'bg-amber-400'   },
    { id: 'product-design',       label: 'Product Design',       color: '#10b981', gradient: 'from-emerald-400 to-teal-500',  bgClass: 'bg-emerald-400' },
    { id: 'data-science',         label: 'Data Science',         color: '#3b82f6', gradient: 'from-blue-400 to-cyan-500',     bgClass: 'bg-blue-400'    },
    { id: 'data-analytics',       label: 'Data Analytics',       color: '#8b5cf6', gradient: 'from-violet-400 to-purple-600', bgClass: 'bg-violet-500'  },
    { id: 'social-science',       label: 'Social Science',       color: '#ef4444', gradient: 'from-red-400 to-rose-500',      bgClass: 'bg-red-400'     },
    { id: 'art-humanities',       label: 'Art & Humanities',     color: '#ec4899', gradient: 'from-pink-400 to-fuchsia-500',  bgClass: 'bg-pink-400'    },
    { id: 'economics',            label: 'Economics',            color: '#f97316', gradient: 'from-orange-400 to-amber-500',  bgClass: 'bg-orange-400'  },
];

export const DIFFICULTY_META = {
    easy:   { label: 'Easy',   color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    medium: { label: 'Medium', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-400'   },
    hard:   { label: 'Hard',   color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-400'     },
} as const;