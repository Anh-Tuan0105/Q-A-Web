import api from '../lib/axios';
import type { PopularTagsResponse } from '../types/tag';

export const tagService = {
    getPopularTags: async (limit = 5) => {
        const response = await api.get<PopularTagsResponse>(`/tags/popular?limit=${limit}`);
        return response.data;
    },
    getAllTags: async (page = 1, limit = 16, keyword = "", sort = "popular") => {
        const response = await api.get<import('../types/tag').PaginatedTagsResponse>(`/tags?page=${page}&limit=${limit}&keyword=${keyword}&sort=${sort}`);
        return response.data;
    },
    incrementTagView: async (name: string) => {
        const response = await api.put<{ success: boolean; viewCount: number }>(`/tags/${name}/view`);
        return response.data;
    }
};
