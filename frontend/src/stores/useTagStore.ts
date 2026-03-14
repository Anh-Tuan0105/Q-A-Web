import { create } from 'zustand';
import { tagService } from '../services/tagService';
import type { TagStore } from '../types/store';


export const useTagStore = create<TagStore>((set, get) => ({
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
    },

    createTag: async (name, description) => {
        try {
            set({ isLoading: true });
            const res = await tagService.createTag(name, description);
            if (res.success) {
                // Re-fetch tags or add to state
                const { tags, totalTags } = get();
                set({
                    tags: [res.tag, ...tags],
                    totalTags: totalTags + 1,
                    isLoading: false
                });
                import('sonner').then(({ toast }) => toast.success(res.message));
                return true;
            }
            return false;
        } catch (error: any) {
            import('sonner').then(({ toast }) => toast.error(error.response?.data?.message || "Lỗi khi tạo Tag"));
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    updateTag: async (id, description) => {
        try {
            set({ isLoading: true });
            const res = await tagService.updateTag(id, description);
            if (res.success) {
                const { tags } = get();
                const updatedTags = tags.map((t: any) => t._id === id ? { ...t, description: res.tag.description } : t);
                set({ tags: updatedTags, isLoading: false });
                import('sonner').then(({ toast }) => toast.success(res.message));
                return true;
            }
            return false;
        } catch (error: any) {
            import('sonner').then(({ toast }) => toast.error(error.response?.data?.message || "Lỗi khi cập nhật Tag"));
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTag: async (id) => {
        try {
            set({ isLoading: true });
            const res = await tagService.deleteTag(id);
            if (res.success) {
                const { tags, totalTags } = get();
                const updatedTags = tags.filter((t: any) => t._id !== id);
                set({ tags: updatedTags, totalTags: totalTags - 1, isLoading: false });
                import('sonner').then(({ toast }) => toast.success(res.message));
                return true;
            }
            return false;
        } catch (error: any) {
            import('sonner').then(({ toast }) => toast.error(error.response?.data?.message || "Lỗi khi xóa Tag"));
            return false;
        } finally {
            set({ isLoading: false });
        }
    }
}));
