import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    setAccessToken: (accessToken: string) => void; 
    clearState: () => void;
    signup: (username: string, password: string, email: string, firstname: string, lastname: string) => Promise<void>;
    signin: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
}

