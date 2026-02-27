import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import quizApi from '../api/quizzes';
import { useQuizSession, useQuizLibrary } from '../store/quiz-store';
import {
    GenerateQuizRequest,
    SubmitQuizRequest,
    QuizCategory,
    Difficulty,
    AttemptAnswer,
} from '../types/quiz.types';
import { AxiosError } from 'axios';

//  Query Keys 

export const QUIZ_KEYS = {
    all:          ['quizzes']                           as const,
    lists:        () => [...QUIZ_KEYS.all, 'list']     as const,
    byCategory:   (c: QuizCategory) => [...QUIZ_KEYS.lists(), c] as const,
    detail:       (id: string)   => [...QUIZ_KEYS.all, 'detail', id] as const,
    attempts:     ['quiz-attempts']                     as const,
    myAttempts:   () => [...QUIZ_KEYS.attempts, 'mine'] as const,
};

//  Generate quiz 


export function useGenerateQuiz() {
    const router = useRouter();
    const { setGeneratedQuizId } = useQuizLibrary();
    const { startQuiz } = useQuizSession();

    return useMutation({
        mutationFn: (data: GenerateQuizRequest) => quizApi.generate(data),
        onSuccess: (quiz) => {
        setGeneratedQuizId(quiz._id);
        startQuiz(quiz);
        toast.success('Quiz generated!');
        router.push(`/quiz-session/${quiz._id}`);
        },
        onError: (err: AxiosError<{ message: string }>) => {
            const msg = err?.response?.data?.message || 'Failed to generate quiz. Try again.';
            toast.error(msg);
        },
    });
}

//  Fetch quiz by ID 

export function useQuiz(id: string) {
    return useQuery({
        queryKey: QUIZ_KEYS.detail(id),
        queryFn: () => quizApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

//Fetch all quizzes (with filters)

export function useQuizzes(params?: {
    category?: QuizCategory;
    difficulty?: Difficulty;
    page?: number;
    limit?: number;
    }) {
    return useQuery({
        queryKey: [...QUIZ_KEYS.lists(), params],
        queryFn: () => quizApi.getAll(params),
        staleTime: 2 * 60 * 1000,
    });
}

// Fetch my attempts (for home page recent activity)

export function useMyAttempts(limit = 5) {
    return useQuery({
        queryKey: QUIZ_KEYS.myAttempts(),
        queryFn: () => quizApi.getMyAttempts({ limit }),
        staleTime: 60 * 1000,
    });
}

// Submit quiz attempt 

export function useSubmitAttempt() {
    const queryClient = useQueryClient();
    const { addAttempt } = useQuizLibrary();

    return useMutation({
        mutationFn: (data: SubmitQuizRequest) => quizApi.submitAttempt(data),
        onSuccess: (attempt) => {
        addAttempt(attempt);
        // Invalidate attempts so home page refreshes
        queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.myAttempts() });
        },
        onError: (err: Error) => {
            console.error('Failed to save attempt:', err);
        },
    });
}

// Quiz session logic hook (used inside quiz-session page)

export function useQuizSessionLogic(quizId: string) {
    const router = useRouter();
    const { quiz, currentIndex, answers, startTime, questionStartTime,
            status, submitAnswer, nextQuestion, finishQuiz, startQuiz, resetSession } = useQuizSession();

    const { data: fetchedQuiz, isLoading } = useQuiz(quizId);
    const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt();

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Start session if quiz is loaded but session not started
    const initSession = useCallback(() => {
        if (fetchedQuiz && (!quiz || quiz._id !== fetchedQuiz._id)) {
        startQuiz(fetchedQuiz);
        }
    }, [fetchedQuiz, quiz, startQuiz]);

    const activeQuiz = quiz || fetchedQuiz;

    const handleSelectAnswer = useCallback((idx: number) => {
        if (selectedAnswer !== null || status !== 'active') return;
        setSelectedAnswer(idx);
        setShowExplanation(true);
    }, [selectedAnswer, status]);

    const handleTimeExpire = useCallback(() => {
        if (selectedAnswer === null) {
        setSelectedAnswer(-1);
        setShowExplanation(true);
        }
    }, [selectedAnswer]);

    const handleNext = useCallback(() => {
        if (!activeQuiz) return;

        const q = activeQuiz.questions[currentIndex];
        const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
        const isCorrect = selectedAnswer === q.correctAnswerIndex;

        const answer: AttemptAnswer = {
        questionIndex: currentIndex,
        selectedAnswer: selectedAnswer ?? -1,
        isCorrect,
        timeSpent,
        };

        submitAnswer(answer);

        const isLast = currentIndex + 1 >= activeQuiz.questions.length;

        if (isLast) {
        finishQuiz();
        // Submit to backend
        const allAnswers = [...answers, answer];
        const duration = Math.round((Date.now() - startTime) / 1000);
        submitAttempt({
            quizId: activeQuiz._id,
            answers: allAnswers.map(a => ({ questionIndex: a.questionIndex, selectedAnswer: a.selectedAnswer })),
            duration,
        });
        } else {
        nextQuestion();
        setSelectedAnswer(null);
        setShowExplanation(false);
        }
    }, [activeQuiz, currentIndex, selectedAnswer, questionStartTime, answers, startTime,
        submitAnswer, finishQuiz, nextQuestion, submitAttempt]);

    const handleRetry = useCallback(() => {
        if (activeQuiz) {
        resetSession();
        startQuiz(activeQuiz);
        setSelectedAnswer(null);
        setShowExplanation(false);
        }
    }, [activeQuiz, resetSession, startQuiz]);

    const handleGoHome = useCallback(() => {
        resetSession();
        router.push('/dashboard/home');
    }, [resetSession, router]);

    return {
        quiz: activeQuiz,
        isLoading,
        isSubmitting,
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
    };
}