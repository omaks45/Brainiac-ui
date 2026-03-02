import apiClient from './client';
import {
    GenerateQuizRequest,
    GenerateQuizResponse,
    Quiz,
    QuizAttempt,
    QuizStats,
    SubmitQuizRequest,
    QuizCategory,
    Difficulty,
} from '../types/quiz.types';

// Response normalisers
type QuizListRaw =
    | Quiz[]
    | { quizzes: Quiz[]; total: number; page: number }
    | { data: Quiz[]; meta?: { totalItems?: number; currentPage?: number } };

function normaliseQuizList(raw: QuizListRaw): { quizzes: Quiz[]; total: number; page: number } {
    if (Array.isArray(raw)) return { quizzes: raw, total: raw.length, page: 1 };
    if ('quizzes' in raw)   return raw as { quizzes: Quiz[]; total: number; page: number };
    if ('data' in raw)      return { quizzes: raw.data, total: raw.meta?.totalItems ?? raw.data.length, page: raw.meta?.currentPage ?? 1 };
    return { quizzes: [], total: 0, page: 1 };
}

// Attempts: backend getUserAttempts returns { data: attempts[], meta: {...} }
type AttemptListRaw =
    | QuizAttempt[]
    | { attempts: QuizAttempt[]; total: number }
    | { data: QuizAttempt[]; meta?: { totalItems?: number } };

function normaliseAttemptList(raw: AttemptListRaw): { attempts: QuizAttempt[]; total: number } {
    if (Array.isArray(raw))   return { attempts: raw, total: raw.length };
    if ('attempts' in raw)    return raw as { attempts: QuizAttempt[]; total: number };
    if ('data' in raw)        return { attempts: raw.data, total: raw.meta?.totalItems ?? raw.data.length };
    return { attempts: [], total: 0 };
}

// Quiz API

export const quizApi = {
    /** POST /api/quizzes/generate */
    generate: async (data: GenerateQuizRequest): Promise<GenerateQuizResponse> => {
        const response = await apiClient.post<GenerateQuizResponse>('/quizzes/generate', data);
        return response.data;
    },

    /** GET /api/quizzes */
    getAll: async (params?: {
        category?: QuizCategory;
        difficulty?: Difficulty;
        page?: number;
        limit?: number;
    }): Promise<{ quizzes: Quiz[]; total: number; page: number }> => {
        const response = await apiClient.get<QuizListRaw>('/quizzes', { params });
        return normaliseQuizList(response.data);
    },

    /** GET /api/quizzes/:id */
    getById: async (id: string): Promise<Quiz> => {
        const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
        return response.data;
    },

    /** POST /api/quiz-attempts/submit */
    submitAttempt: async (data: SubmitQuizRequest): Promise<QuizAttempt> => {
        const response = await apiClient.post<QuizAttempt>('/quiz-attempts/submit', data);
        return response.data;
    },

    /**
     * GET /api/quiz-attempts
     * Backend returns { data: QuizAttempt[], meta: { currentPage, itemsPerPage, totalItems, totalPages } }
     */
    getMyAttempts: async (params?: {
        page?: number;
        limit?: number;
    }): Promise<{ attempts: QuizAttempt[]; total: number }> => {
        const response = await apiClient.get<AttemptListRaw>('/quiz-attempts', { params });
        return normaliseAttemptList(response.data);
    },

    /**
     * GET /api/quiz-attempts/stats
     * Returns: { totalAttempts, averageScore, averagePercentage,
     *            totalTimeSpent, bestScore, bestPercentage }
     */
    getMyStats: async (): Promise<QuizStats> => {
        const response = await apiClient.get<QuizStats>('/quiz-attempts/stats');
        return response.data;
    },

    /** GET /api/quiz-attempts/:id */
    getAttemptById: async (id: string): Promise<QuizAttempt> => {
        const response = await apiClient.get<QuizAttempt>(`/quiz-attempts/${id}`);
        return response.data;
    },
};

export default quizApi;