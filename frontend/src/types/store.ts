import type { User } from "./user";
import type { QuestionType } from '../types/question';
import type { PopularTag } from '../types/tag';

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    setAccessToken: (accessToken: string) => void;
    clearState: () => void;
    signup: (username: string, password: string, email: string, firstname: string, lastname: string) => Promise<void>;
    signin: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    updateProfile: (data: Partial<User> | FormData) => Promise<boolean>;
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
    isLoading: boolean;
    error: string | null;

    fetchPopularTags: (limit?: number) => Promise<void>;
}
