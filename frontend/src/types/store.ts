import type { User } from "./user";
import type { QuestionType } from '../types/question';
import type { PopularTag } from '../types/tag';
import type { NotificationType } from '../types/notification';
import type { AnswerType } from '../types/answer';
import type { Socket } from 'socket.io-client';


export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    setAccessToken: (accessToken: string) => void;
    clearState: () => void;
    signup: (username: string, password: string, email: string, firstname: string, lastname: string) => Promise<boolean>;
    signin: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    requestEmailChange: (newEmail: string) => Promise<any>;
    verifyEmailChange: (newEmail: string, otp: string) => Promise<any>;
}


export interface QuestionStore {
    questions: QuestionType[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalQuestions: number;
    activeTab: string;

    // Actions
    fetchQuestions: (page?: number, sort?: string, tag?: string) => Promise<void>;
    setActiveTab: (tab: string) => void;
    setPage: (page: number) => void;
    addNewQuestion: (question: QuestionType) => void;
}

export interface TagStore {
    popularTags: PopularTag[];
    tags: import('./tag').Tag[];
    currentPage: number;
    totalPages: number;
    totalTags: number;
    isLoading: boolean;
    error: string | null;

    fetchPopularTags: (limit?: number) => Promise<void>;
    fetchTags: (page?: number, limit?: number, keyword?: string, sort?: string) => Promise<void>;
}

export interface NotificationStore {
    notifications: NotificationType[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: NotificationType) => void;
}

export interface QuestionDetailStore {
    question: QuestionType | null;
    answers: AnswerType[];
    isLoading: boolean;
    error: string | null;

    fetchQuestionDetail: (id: string) => Promise<void>;
    voteQuestion: (id: string, value: 1 | -1) => Promise<void>;
    voteAnswer: (id: string, value: 1 | -1) => Promise<void>;
    postAnswer: (quesId: string, content: string) => Promise<boolean>;
    acceptAnswer: (id: string, quesId: string) => Promise<void>;
    addAnswer: (answer: AnswerType) => void;
}

export interface SocketStore {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
    joinRoom: (roomName: string) => void;
    leaveRoom: (roomName: string) => void;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback?: (data: any) => void) => void;
}

export interface ProfileStore {
    userProfile: any | null; // Detailed user info
    stats: {
        totalQuestions: number;
        totalAnswers: number;
        totalViews: number;
        reputation: number;
    };
    topQuestions: any[];
    topAnswers: any[];
    topTags: any[];
    isLoading: boolean;
    error: string | null;
    latestViews: number | null;

    fetchUserProfile: (userId: string) => Promise<void>;
    incrementProfileView: (userId: string) => Promise<void>;
    fetchTopAnswers: (userId: string, sort: "votes" | "newest") => Promise<void>;
    updateProfileViews: (profileId: string, views: number) => void;
}