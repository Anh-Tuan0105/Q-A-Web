import type { User } from "./user";

export type NotificationEventType = "new_comment" | "new_answer" | "vote" | "approved" | "rejected";

export interface NotificationType {
    _id: string;
    receiverId: string;
    senderId: User;
    targetId: {
        _id: string;
        title?: string;
    };
    targetType: "Question" | "Answer" | "Vote" | "Comment";
    type: NotificationEventType;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
    updatedAt: string;
}
