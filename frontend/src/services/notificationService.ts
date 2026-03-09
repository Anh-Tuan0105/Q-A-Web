import axios from '../lib/axios';

export const notificationService = {
    // Lấy danh sách thông báo
    getNotifications: async () => {
        const response = await axios.get('/notifications');
        return response.data;
    },

    // Đánh dấu 1 thông báo đã đọc
    markAsRead: async (id: string) => {
        const response = await axios.put(`/notifications/${id}/read`);
        return response.data;
    },

    // Đánh dấu tất cả thông báo đã đọc
    markAllAsRead: async () => {
        const response = await axios.put('/notifications/read-all');
        return response.data;
    }
};
