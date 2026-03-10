import type { User } from "./user";

export interface NotificationType {
    _id: string;
    receiverId: string;
    senderId: User;
    targetId: {
        _id: string;
        title?: string;
    };
    targetType: "Question" | "Answer" | "Vote";
    message: string;
    isRead: boolean;
    link: string;
    createdAt: string;
    updatedAt: string;
}
