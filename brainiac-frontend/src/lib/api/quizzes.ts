import apiClient from './client';
import {
    GenerateQuizRequest,
    GenerateQuizResponse,
    Quiz,
    QuizAttempt,
    SubmitQuizRequest,
    QuizCategory,
    Difficulty,
} from '../types/quiz.types';

export const quizApi = {
    /**
     * 
     * @param data 
     * @returns 
     */
    // POST /api/quizzes/generate
    generate: async (data: GenerateQuizRequest): Promise<GenerateQuizResponse> => {
        console.log('Generating quiz:', data);
        const response = await apiClient.post<GenerateQuizResponse>('/quizzes/generate', data);
        console.log('Quiz generated:', response.data._id);
        return response.data;
    },

    /**
     * 
     * @param params 
     * @returns 
     */
    // GET /api/quizzes
    getAll: async (params?: {
        category?: QuizCategory;
        difficulty?: Difficulty;
        page?: number;
        limit?: number;
    }): Promise<{ quizzes: Quiz[]; total: number; page: number }> => {
        const response = await apiClient.get('/quizzes', { params });
        return response.data;
    },

    /**
     * 
     * @param id 
     * @returns 
     */
    // GET /api/quizzes/:id
    getById: async (id: string): Promise<Quiz> => {
        const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
        return response.data;
    },

    /**
     * 
     * @param category 
     * @returns 
     */
    // GET /api/quizzes?category=mathematics
    getByCategory: async (category: QuizCategory): Promise<Quiz[]> => {
        const response = await apiClient.get<Quiz[]>('/quizzes', {
            params: { category },
        });
        return response.data;
    },

    /**
     * 
     * @param data 
     * @returns 
     */
    // POST /api/quiz-attempts/submit
    submitAttempt: async (data: SubmitQuizRequest): Promise<QuizAttempt> => {
        console.log('Submitting quiz attempt for quiz:', data.quizId);
        const response = await apiClient.post<QuizAttempt>('/quiz-attempts/submit', data);
        console.log('Attempt saved:', response.data._id);
        return response.data;
    },

    // GET /api/quiz-attempts?userId=123
    getMyAttempts: async (params?: {
        page?: number;
        limit?: number;
    }): Promise<{ attempts: QuizAttempt[]; total: number }> => {
        const response = await apiClient.get('/quiz-attempts', { params });
        return response.data;
    },

    // GET /api/quiz-attempts/:id
    getAttemptById: async (id: string): Promise<QuizAttempt> => {
        const response = await apiClient.get<QuizAttempt>(`/quiz-attempts/${id}`);
        return response.data;
    },

    // GET /api/quiz-attempts/stats — user quiz statistics
    getMyStats: async () => {
        const response = await apiClient.get('/quiz-attempts/stats');
        return response.data;
    },

    // GET /api/quizzes/:id/stats
    getQuizStats: async (id: string) => {
        const response = await apiClient.get(`/quizzes/${id}/stats`);
        return response.data;
    },
};

export default quizApi;