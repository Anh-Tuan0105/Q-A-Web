export interface Author {
    _id: string;
    userName: string;
    displayName: string;
    avatarUrl?: string;
}

export interface Tag {
    _id: string;
    name: string;
}

export interface QuestionType {
    _id: string;
    title: string;
    content: string;
    tags: Tag[];
    userId: Author;
    viewCount: number;
    upvoteCount: number;
    downvoteCount: number;
    answersCount: number;
    status: string;
    createdAt: string;
    lastActivityAt: string;
    lastActivityUser?: Author;
}

export interface FetchedData {
    success: boolean;
    questions: QuestionType[];
    totalPages: number;
    currentPage: number;
    totalQuestions: number;
}
