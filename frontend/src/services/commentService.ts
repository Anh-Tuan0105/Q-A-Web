import api from '../lib/axios';

export interface Comment {
    _id: string;
    targetId: string;
    targetType: 'Question' | 'Answer';
    content: string;
    moderationStatus: 'visible' | 'pending_ai' | 'hidden' | 'pending_review';
    userId: {
        _id: string;
        userName: string;
        displayName: string;
        avatarUrl: string;
    };
    createdAt: string;
}

interface CreateCommentResponse {
    success: boolean;
    pending?: boolean;
    message: string;
    comment?: Comment;
}

export const commentService = {
    getComments: async (targetType: 'Question' | 'Answer', targetId: string) => {
        const response = await api.get<{ success: boolean; comments: Comment[] }>(
            `/comments/${targetType}/${targetId}`
        );
        return response.data.comments;
    },

    createComment: async (targetType: 'Question' | 'Answer', targetId: string, content: string) => {
        const response = await api.post<CreateCommentResponse>(
            `/comments/${targetType}/${targetId}`,
            { content }
        );
        return response.data;
    },

    deleteComment: async (id: string) => {
        const response = await api.delete(`/comments/${id}`);
        return response.data;
    },
};
