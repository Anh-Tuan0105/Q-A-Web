import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { NotificationType } from '../types/notification';
import type { NotificationStore } from '../types/store';


export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await notificationService.getNotifications();
            if (data.success) {
                const notifications = data.notifications;
                const unreadCount = notifications.filter((n: NotificationType) => !n.isRead).length;
                set({ notifications, unreadCount, isLoading: false });
            } else {
                set({ error: "Lấy thông báo thất bại", isLoading: false });
            }
        } catch (error: any) {
            set({ error: error.message || "Lỗi khi lấy thông báo", isLoading: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            const data = await notificationService.markAsRead(id);
            if (data.success) {
                const updatedNotifications = get().notifications.map(n => 
                    n._id === id ? { ...n, isRead: true } : n
                );
                const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
                set({ notifications: updatedNotifications, unreadCount });
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
        }
    },

    markAllAsRead: async () => {
        try {
            const data = await notificationService.markAllAsRead();
            if (data.success) {
                const updatedNotifications = get().notifications.map(n => ({ ...n, isRead: true }));
                set({ notifications: updatedNotifications, unreadCount: 0 });
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu tất cả thông báo đã đọc:", error);
        }
    },

    addNotification: (notification: NotificationType) => {
        // notification sẽ đi vào đầu mảng
        const notifications = [notification, ...get().notifications];
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
    }
}));
