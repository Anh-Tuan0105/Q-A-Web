import { create } from 'zustand';
import { reportService, type Report } from '../services/reportService';
import { commentService, type Comment } from '../services/commentService';
import { toast } from 'sonner';

interface StoreState {
    // Reports state
    reports: Report[];
    totalReports: number;
    currentReportPage: number;
    totalReportPages: number;
    isLoadingReports: boolean;
    
    // Actions for reports
    fetchReports: (status?: string, contentType?: string, keyword?: string, page?: number, limit?: number) => Promise<void>;
    approveReport: (reportId: string) => Promise<void>;
    rejectReport: (reportId: string) => Promise<void>;
    deleteReport: (reportId: string) => Promise<void>;

    // Comments state
    // We store comments mapped by targetId (for Question or Answer)
    commentsByTarget: Record<string, Comment[]>;
    isLoadingComments: boolean;

    // Actions for comments
    fetchComments: (targetType: 'Question' | 'Answer', targetId: string) => Promise<void>;
    addComment: (targetType: 'Question' | 'Answer', targetId: string, content: string) => Promise<{ success: boolean; message: string; pending?: boolean }>;
    updateComment: (targetId: string, commentId: string, content: string) => Promise<void>;
    deleteComment: (targetId: string, commentId: string) => Promise<void>;
    
    // Realtime Socket actions for comments
    receiveNewComment: (targetId: string, comment: Comment) => void;
    removeHiddenComment: (targetId: string, commentId: string) => void;
}

export const useCommentReportStore = create<StoreState>((set) => ({
    reports: [],
    totalReports: 0,
    currentReportPage: 1,
    totalReportPages: 1,
    isLoadingReports: false,

    commentsByTarget: {},
    isLoadingComments: false,

    fetchReports: async (status = 'Pending', contentType = '', keyword = '', page = 1, limit = 10) => {
        set({ isLoadingReports: true });
        try {
            const data = await reportService.getReports(status, contentType, keyword, page, limit);
            if (data.success) {
                set({
                    reports: data.reports,
                    totalReports: data.total,
                    currentReportPage: data.currentPage,
                    totalReportPages: data.totalPages
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách báo cáo');
        } finally {
            set({ isLoadingReports: false });
        }
    },

    approveReport: async (reportId) => {
        try {
            await reportService.approveReport(reportId);
            set(state => ({
                reports: state.reports.filter(r => r._id !== reportId),
                totalReports: state.totalReports - 1
            }));
            toast.success("Đã duyệt báo cáo");
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi duyệt báo cáo');
        }
    },

    rejectReport: async (reportId) => {
        try {
            await reportService.rejectReport(reportId);
            set(state => ({
                reports: state.reports.filter(r => r._id !== reportId),
                totalReports: state.totalReports - 1
            }));
            toast.success("Đã xác nhận vi phạm (Từ chối báo cáo)");
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi từ chối báo cáo');
        }
    },

    deleteReport: async (reportId) => {
        try {
            await reportService.deleteReport(reportId);
            set(state => ({
                reports: state.reports.filter(r => r._id !== reportId),
                totalReports: state.totalReports - 1
            }));
            toast.success("Đã xóa báo cáo");
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi xóa báo cáo');
        }
    },

    fetchComments: async (targetType, targetId) => {
        set({ isLoadingComments: true });
        try {
            const comments = await commentService.getComments(targetType, targetId);
            set((state) => ({
                commentsByTarget: { ...state.commentsByTarget, [targetId]: comments }
            }));
        } catch (error) {
            console.error("Lỗi khi tải bình luận:", error);
        } finally {
            set({ isLoadingComments: false });
        }
    },

    addComment: async (targetType, targetId, content) => {
        try {
            const res = await commentService.createComment(targetType, targetId, content);
            return { success: res.success, message: res.message, pending: res.pending };
        } catch (error: any) {
            const msg = error.response?.data?.message || "Không thể đăng bình luận";
            toast.error(msg);
            throw error;
        }
    },

    updateComment: async (targetId, commentId, content) => {
        try {
            const res = await commentService.updateComment(commentId, content);
            if (res.success && res.comment) {
                set((state) => {
                    const targetComments = state.commentsByTarget[targetId] || [];
                    return {
                        commentsByTarget: {
                            ...state.commentsByTarget,
                            [targetId]: targetComments.map(c => c._id === commentId ? res.comment! : c)
                        }
                    };
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể cập nhật bình luận");
            throw error;
        }
    },

    deleteComment: async (targetId, commentId) => {
        try {
            await commentService.deleteComment(commentId);
            set((state) => {
                const targetComments = state.commentsByTarget[targetId] || [];
                return {
                    commentsByTarget: {
                        ...state.commentsByTarget,
                        [targetId]: targetComments.filter(c => c._id !== commentId)
                    }
                };
            });
            toast.success("Đã xóa bình luận");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể xóa bình luận");
            throw error;
        }
    },

    receiveNewComment: (targetId, comment) => {
        set((state) => {
             const targetComments = state.commentsByTarget[targetId] || [];
             // Check if already exists to prevent duplicate (socket might fire multiple times or after local update)
             if (targetComments.some(c => c._id === comment._id)) return state;
             return {
                 commentsByTarget: {
                     ...state.commentsByTarget,
                     [targetId]: [...targetComments, comment]
                 }
             };
        });
    },

    removeHiddenComment: (targetId, commentId) => {
        set((state) => {
             const targetComments = state.commentsByTarget[targetId] || [];
             return {
                 commentsByTarget: {
                     ...state.commentsByTarget,
                     [targetId]: targetComments.filter(c => c._id !== commentId)
                 }
             };
        });
    }

}));
