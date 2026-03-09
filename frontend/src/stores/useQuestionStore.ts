import { create } from 'zustand';
import { questionService } from '../services/questionService';
import type { QuestionStore } from '../types/store';



export const useQuestionStore = create<QuestionStore>((set, get) => ({
    questions: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalQuestions: 0,
    activeTab: 'interesting', // default sort

    fetchQuestions: async (page = 1, sort = 'interesting', tag = '') => {
        set({ isLoading: true, error: null });
        try {
            const data = await questionService.getQuestions(page, sort, tag);

            if (data.success) {
                set({
                    questions: data.questions,
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalQuestions: data.totalQuestions,
                    isLoading: false,
                });
            } else {
                set({ error: "Failed to fetch questions", isLoading: false });
            }
        } catch (error: any) {
            console.error("Error fetching questions:", error);
            set({
                error: error.response?.data?.message || "Lỗi khi tải danh sách câu hỏi",
                isLoading: false
            });
        }
    },

    setActiveTab: (tab: string) => {
        set({ activeTab: tab, currentPage: 1 }); // Xóa trang về 1 khi đổi tab
        get().fetchQuestions(1, tab); // Gọi fetch luôn
    },

    setPage: (page: number) => {
        if (page < 1 || page > get().totalPages) return;
        set({ currentPage: page });
        get().fetchQuestions(page, get().activeTab);
    }
}));
