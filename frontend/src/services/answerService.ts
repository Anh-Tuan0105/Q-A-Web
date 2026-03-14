import api from '../lib/axios';
import type { AnswersResponse } from '../types/answer';

export const answerService = {
    getAnswersByQuestion: async (quesId: string) => {
        const response = await api.get<AnswersResponse>(`/answers/${quesId}`);
        return response.data;
    },

    voteAnswer: async (id: string, value: 1 | -1) => {
        const response = await api.post(`/answers/${id}/vote`, { value });
        return response.data;
    },

    createAnswer: async (quesId: string, content: string) => {
        const response = await api.post(`/answers/${quesId}`, { content });
        return response.data;
    },

    acceptAnswer: async (id: string, quesId: string) => {
        const response = await api.patch(`/answers/${id}/accept`, { quesId });
        return response.data;
    },

    updateAnswer: async (id: string, content: string) => {
        const response = await api.put(`/answers/${id}`, { content });
        return response.data;
    },

    deleteAnswer: async (id: string) => {
        const response = await api.delete(`/answers/${id}`);
        return response.data;
    }
};
