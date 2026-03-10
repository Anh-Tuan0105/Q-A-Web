import { create } from 'zustand';
import { tagService } from '../services/tagService';
import type { TagStore } from '../types/store';


export const useTagStore = create<TagStore>((set) => ({
    popularTags: [],
    isLoading: false,
    error: null,
    tags: [],
    currentPage: 1,
    totalPages: 0,
    totalTags: 0,

    fetchPopularTags: async (limit = 5) => {
        set({ isLoading: true, error: null });
        try {
            const data = await tagService.getPopularTags(limit);
            if (data.success) {
                set({ popularTags: data.tags, isLoading: false });
            } else {
                set({ error: "Failed to fetch popular tags", isLoading: false });
            }
        } catch (error: any) {
            console.error("Error fetching popular tags:", error);
            set({
                error: error.response?.data?.message || "Lỗi tải Tags phổ biến",
                isLoading: false
            });
        }
    },

    fetchTags: async (page = 1, limit = 16, keyword = "", sort = "popular") => {
        set({ isLoading: true, error: null });
        try {
            const data = await tagService.getAllTags(page, limit, keyword, sort);
            if (data.success) {
                set({
                    tags: data.tags,
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalTags: data.totalTags,
                    isLoading: false
                });
            } else {
                set({ error: "Failed to fetch tags", isLoading: false });
            }
        } catch (error: any) {
            console.error("Error fetching tags:", error);
            set({
                error: error.response?.data?.message || "Lỗi tải danh sách thẻ",
                isLoading: false
            });
        }
    }
}));
