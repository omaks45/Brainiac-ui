import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import quizApi from '../api/quizzes';
import { useQuizSession, useQuizLibrary } from '../store/quiz-store';
import {
  GenerateQuizRequest,
  SubmitQuizRequest,
  QuizAnswerPayload,
  QuizCategory,
  Difficulty,
  AttemptAnswer,
  QuizStats,
} from '../types/quiz.types';

//Query Keys 

export const QUIZ_KEYS = {
  all:        ['quizzes']                            as const,
  lists:      () => [...QUIZ_KEYS.all, 'list']      as const,
  detail:     (id: string) => [...QUIZ_KEYS.all, 'detail', id] as const,
  attempts:   ['quiz-attempts']                      as const,
  myAttempts: () => [...QUIZ_KEYS.attempts, 'mine'] as const,
  myStats:    () => [...QUIZ_KEYS.attempts, 'stats'] as const,
};

//Generate quiz

export function useGenerateQuiz() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setGeneratedQuizId } = useQuizLibrary();
  const { startQuiz } = useQuizSession();

  return useMutation({
    mutationFn: (data: GenerateQuizRequest) => quizApi.generate(data),
    onSuccess: (quiz) => {
      setGeneratedQuizId(quiz._id);
      startQuiz(quiz);
      toast.success('Quiz generated!');
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lists() });
      router.push(`/quiz-session/${quiz._id}`);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message ?? 'Failed to generate quiz. Try again.';
      toast.error(msg);
    },
  });
}

//Fetch single quiz

export function useQuiz(id: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.detail(id),
    queryFn:  () => quizApi.getById(id),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
  });
}

//Fetch all quizzes

export function useQuizzes(params?: {
  category?: QuizCategory;
  difficulty?: Difficulty;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...QUIZ_KEYS.lists(), params],
    queryFn:  () => quizApi.getAll(params),
    staleTime: 0,
  });
}

//Fetch my recent attempts (activity feed)

export function useMyAttempts(limit = 5) {
  return useQuery({
    queryKey: QUIZ_KEYS.myAttempts(),
    queryFn:  () => quizApi.getMyAttempts({ limit }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

//Fetch my stats — GET /api/quiz-attempts/stats
// Backend returns: { totalAttempts, averageScore, averagePercentage,
//                   totalTimeSpent, bestScore, bestPercentage }

export function useMyStats() {
  return useQuery<QuizStats>({
    queryKey: QUIZ_KEYS.myStats(),
    queryFn:  () => quizApi.getMyStats(),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

//Submit quiz attempt

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  const { addAttempt } = useQuizLibrary();

  return useMutation({
    mutationFn: (data: SubmitQuizRequest) => quizApi.submitAttempt(data),
    onSuccess: (attempt) => {
      addAttempt(attempt);
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.myAttempts() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.myStats() });
    },
    onError: (err: unknown) => {
      console.error('Failed to save attempt:', err);
    },
  });
}

//Quiz session logic

export function useQuizSessionLogic(quizId: string) {
  const router = useRouter();
  const {
    quiz, currentIndex, answers, startTime, questionStartTime,
    status, submitAnswer, nextQuestion, finishQuiz, startQuiz, resetSession,
  } = useQuizSession();

  const { data: fetchedQuiz, isLoading } = useQuiz(quizId);
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt();

  const [selectedAnswer, setSelectedAnswer]   = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const initSession = useCallback(() => {
    if (fetchedQuiz && (!quiz || quiz._id !== fetchedQuiz._id)) {
      startQuiz(fetchedQuiz);
    }
  }, [fetchedQuiz, quiz, startQuiz]);

  const activeQuiz = quiz ?? fetchedQuiz;

  const handleSelectAnswer = useCallback((idx: number) => {
    if (selectedAnswer !== null || status !== 'active') return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
  }, [selectedAnswer, status]);

  const handleTimeExpire = useCallback(() => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // -1 = timed out (internal only, clamped before sending)
      setShowExplanation(true);
    }
  }, [selectedAnswer]);

  const handleNext = useCallback(() => {
    if (!activeQuiz) return;

    const q         = activeQuiz.questions[currentIndex];
    const timeSpent = Math.max(0, Math.round((Date.now() - questionStartTime) / 1000));
    const isCorrect = selectedAnswer !== null
      && selectedAnswer !== -1
      && selectedAnswer === q.correctAnswerIndex;

    // Internal answer — keeps -1 for UI (shows no option highlighted)
    const internalAnswer: AttemptAnswer = {
      questionIndex:  currentIndex,
      selectedAnswer: selectedAnswer ?? -1,
      isCorrect,
      timeSpent,
    };

    submitAnswer(internalAnswer);

    const isLast = currentIndex + 1 >= activeQuiz.questions.length;

    if (isLast) {
      finishQuiz();
      const allAnswers = [...answers, internalAnswer];

      //Build payload that satisfies SubmitAnswerDto constraints:
      //    selectedAnswer @Min(0) @Max(3) — clamp -1 (timed out) → 0
      //    timeSpent      @Min(0)         — already clamped above
      const payload: SubmitQuizRequest = {
        quizId: activeQuiz._id,
        answers: allAnswers.map((a): QuizAnswerPayload => ({
          questionIndex:  a.questionIndex,
          selectedAnswer: Math.max(0, a.selectedAnswer),
          timeSpent:      Math.max(0, a.timeSpent),
        })),
      };

      submitAttempt(payload);
    } else {
      nextQuestion();
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [
    activeQuiz, currentIndex, selectedAnswer, questionStartTime,
    answers, submitAnswer, finishQuiz, nextQuestion, submitAttempt,
  ]);

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