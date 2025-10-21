/**
 * Challenge status enum matching backend
 */
export enum ChallengeStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    DECLINED = 'DECLINED',
    EXPIRED = 'EXPIRED',
}

/**
 * Challenge difficulty levels
 */
export enum ChallengeDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

/**
 * Quiz category
 */
export interface QuizCategory {
    id: string;
    name: string;
    icon: string;
    description?: string;
}

/**
 * Challenge participant
 */
export interface ChallengeParticipant {
    userId: string;
    username: string;
    displayName: string;
    avatar: string;
    score?: number;
    completedAt?: string;
}

/**
 * Challenge entity matching backend
 */
export interface Challenge {
    _id: string;
    challenger: ChallengeParticipant;
    challenged: ChallengeParticipant;
    category: string;
    difficulty: ChallengeDifficulty;
    status: ChallengeStatus;
    quizId?: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    winner?: string; // userId of winner
}

/**
 * Create challenge request
 */
export interface CreateChallengeRequest {
    challengedUserId: string;
    category: string;
    difficulty: ChallengeDifficulty;
}

/**
 * Challenge response action
 */
export interface ChallengeActionRequest {
    challengeId: string;
    action: 'accept' | 'decline';
}

/**
 * WebSocket challenge events matching backend
 */
export interface ChallengeCreatedEvent {
    challenge: Challenge;
}

export interface ChallengeAcceptedEvent {
    challenge: Challenge;
}

export interface ChallengeCompletedEvent {
    challenge: Challenge;
    winner: ChallengeParticipant;
}

export interface ChallengeDeclinedEvent {
    challenge: Challenge;
    reason?: string;
}

/**
 * Challenge notification
 */
export interface ChallengeNotification {
    id: string;
    type: 'challenge:created' | 'challenge:accepted' | 'challenge:completed' | 'challenge:declined';
    challenge: Challenge;
    message: string;
    read: boolean;
    createdAt: string;
}