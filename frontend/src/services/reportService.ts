import api from '../lib/axios';

export interface Report {
    _id: string;
    content: {
        title?: string;
        body: string;
    };
    contentType: 'Question' | 'Answer' | 'Comment';
    reason: string;
    userId: {
        _id: string;
        userName: string;
        displayName: string;
        avatarUrl: string;
        email: string;
    };
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
}

export interface ReportListResponse {
    success: boolean;
    reports: Report[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export const reportService = {
    getReports: async (status = 'Pending', contentType = '', keyword = '', page = 1, limit = 10) => {
        const params = new URLSearchParams({ status, page: page.toString(), limit: limit.toString() });
        if (contentType) params.append('contentType', contentType);
        if (keyword) params.append('keyword', keyword);
        const response = await api.get<ReportListResponse>(`/admin/reports?${params}`);
        return response.data;
    },

    approveReport: async (id: string) => {
        const response = await api.patch(`/admin/reports/${id}/approve`);
        return response.data;
    },

    rejectReport: async (id: string) => {
        const response = await api.patch(`/admin/reports/${id}/reject`);
        return response.data;
    },

    deleteReport: async (id: string) => {
        const response = await api.delete(`/admin/reports/${id}`);
        return response.data;
    },
};
