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
        linkedin?: string;
    };
    reputation?: number;
    profileViews?: number;
    createdAt: string;
    updatedAt: string;
}
