import api from '../lib/axios';

export interface SimilarQuestion {
    _id: string;
    title: string;
    similarity: number | null;
}

export const similarityService = {
    findSimilarQuestions: async (title: string, excludeId?: string): Promise<SimilarQuestion[]> => {
        const response = await api.post<SimilarQuestion[]>('/similarity/questions', { title, excludeId });
        return response.data;
    }
};
