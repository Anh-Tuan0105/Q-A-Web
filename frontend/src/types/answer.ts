import type { Author } from "./question";

export interface AnswerType {
    _id: string;
    quesId: string;
    userId: Author;
    content: string;
    upvoteCount: number;
    downvoteCount: number;
    isAccepted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AnswersResponse {
    success: boolean;
    answers: AnswerType[];
}
