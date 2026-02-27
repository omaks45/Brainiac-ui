import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Quiz,
    QuizAttempt,
    AttemptAnswer,
    QuizSessionState,
} from '../types/quiz.types';

// Session Store (quiz-taking state)

interface QuizSessionStore extends QuizSessionState {
  // Actions
    startQuiz: (quiz: Quiz) => void;
    submitAnswer: (answer: AttemptAnswer) => void;
    nextQuestion: () => void;
    finishQuiz: () => void;
    resetSession: () => void;
    setStatus: (status: QuizSessionState['status']) => void;
}

const initialSession: QuizSessionState = {
    quiz: null,
    currentIndex: 0,
    answers: [],
    startTime: 0,
    questionStartTime: 0,
    status: 'idle',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useQuizSession = create<QuizSessionStore>()((set, get) => ({
    ...initialSession,

    startQuiz: (quiz) =>
        set({
        quiz,
        currentIndex: 0,
        answers: [],
        startTime: Date.now(),
        questionStartTime: Date.now(),
        status: 'active',
        }),

    

    submitAnswer: (answer) =>
        set((state) => ({
        answers: [...state.answers, answer],
        })),

    nextQuestion: () =>
        set((state) => ({
        currentIndex: state.currentIndex + 1,
        questionStartTime: Date.now(),
        })),

    finishQuiz: () => set({ status: 'finished' }),

    resetSession: () => set(initialSession),

    setStatus: (status) => set({ status }),
}));

//  Quiz Library Store (browsing / listing)

interface QuizLibraryStore {
    recentAttempts: QuizAttempt[];
    generatedQuizId: string | null; // id of freshly generated quiz to navigate to

    setRecentAttempts: (attempts: QuizAttempt[]) => void;
    addAttempt: (attempt: QuizAttempt) => void;
    setGeneratedQuizId: (id: string | null) => void;
}

export const useQuizLibrary = create<QuizLibraryStore>()(
    persist(
        (set) => ({
        recentAttempts: [],
        generatedQuizId: null,

        setRecentAttempts: (attempts) => set({ recentAttempts: attempts }),

        addAttempt: (attempt) =>
            set((state) => ({
            recentAttempts: [attempt, ...state.recentAttempts].slice(0, 20),
            })),

        setGeneratedQuizId: (id) => set({ generatedQuizId: id }),
        }),
        { name: 'brainiac-quiz-library' }
    )
);