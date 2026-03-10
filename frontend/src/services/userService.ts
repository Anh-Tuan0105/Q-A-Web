import api from '../lib/axios';

export const userService = {
    getUserProfile: async (userId: string) => {
        const response = await api.get(`/users/profile/${userId}`);
        return response.data;
    },
    incrementProfileView: async (userId: string) => {
        const response = await api.put(`/users/profile/${userId}/view`);
        return response.data;
    },
    getUserQuestions: async (userId: string, page = 1, limit = 10, sort = "newest") => {
        const response = await api.get(`/users/profile/${userId}/questions`, {
            params: { page, limit, sort }
        });
        return response.data;
    },
    getUserAnswers: async (userId: string, page = 1, limit = 10, sort = "newest") => {
        const response = await api.get(`/users/profile/${userId}/answers`, {
            params: { page, limit, sort }
        });
        return response.data;
    }
};
