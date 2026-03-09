import { create } from 'zustand';
import { tagService } from '../services/tagService';
import type { TagStore } from '../types/store';


export const useTagStore = create<TagStore>((set) => ({
    popularTags: [],
    isLoading: false,
    error: null,

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
    }
}));
