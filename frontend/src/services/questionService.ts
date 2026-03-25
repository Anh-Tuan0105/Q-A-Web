import api from '../lib/axios';
import type { FetchedData, QuestionType } from '../types/question';

export const questionService = {
    getQuestions: async (page = 1, sort = 'interesting', tag = '', keyword = '', status = '') => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '4'); // Backend default is 4
        params.append('sort', sort);
        if (tag) {
            params.append('tag', tag);
        }
        if (keyword) {
            params.append('keyword', keyword);
        }
        if (status) {
            params.append('status', status);
        }

        const response = await api.get<FetchedData>(`/questions?${params.toString()}`);
        return response.data;
    },

    searchQuestions: async (keyword: string) => {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '5');
        params.append('sort', 'interesting');
        params.append('keyword', keyword);

        const response = await api.get<FetchedData>(`/questions?${params.toString()}`);
        return response.data;
    },

    getQuestionById: async (id: string) => {
        const response = await api.get<{ success: boolean; question: QuestionType }>(`/questions/${id}`);
        return response.data;
    },

    voteQuestion: async (id: string, value: 1 | -1) => {
        const response = await api.post(`/questions/${id}/vote`, { value });
        return response.data;
    },

    createQuestion: async (title: string, content: string, tags: string[]) => {
        const response = await api.post(`/questions`, { title, content, tags });
        return response.data;
    },

    updateQuestion: async (id: string, title: string, content: string, tags: string[]) => {
        const response = await api.put(`/questions/${id}`, { title, content, tags });
        return response.data;
    },

    deleteQuestion: async (id: string) => {
        const response = await api.delete(`/questions/${id}`);
        return response.data;
    }
};
