import api from '../lib/axios';
import type { PopularTagsResponse } from '../types/tag';

export const tagService = {
    getPopularTags: async (limit = 5) => {
        const response = await api.get<PopularTagsResponse>(`/tags/popular?limit=${limit}`);
        return response.data;
    }
};
