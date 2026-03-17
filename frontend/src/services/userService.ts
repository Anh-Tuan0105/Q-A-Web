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
    },
    getMembers: async (page = 1, limit = 12, keyword = "", sort = "reputation") => {
        const response = await api.get('/users', {
            params: { page, limit, keyword, sort }
        });
        return response.data;
    },
    // Admin Only
    getAllUsers: async () => {
        const response = await api.get('/users/admin/all');
        return response.data;
    },
    banUser: async (userId: string) => {
        const response = await api.put(`/users/${userId}/ban`);
        return response.data;
    },
    unbanUser: async (userId: string) => {
        const response = await api.put(`/users/${userId}/unban`);
        return response.data;
    },
    updateReputation: async (userId: string, reputation: number) => {
        const response = await api.put(`/users/${userId}/reputation`, { reputation });
        return response.data;
    },
    syncReputation: async () => {
        const response = await api.post('/users/admin/sync-reputation');
        return response.data;
    }
};
