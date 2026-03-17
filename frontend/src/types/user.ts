export interface User {
    _id: string;
    userName: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    avatarId?: string;
    bio?: string;
    jobTitle?: string;
    location?: string;
    websitePersonal?: string;
    socialLinks?: {
        github?: string;
        facebook?: string;
    };
    reputation?: number;
    profileViews?: number;
    role?: 'user' | 'admin';
    isBanned?: boolean;
    createdAt: string;
    updatedAt: string;
}
