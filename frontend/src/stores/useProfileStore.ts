import { create } from 'zustand';
import type { ProfileStore } from '../types/store';
import { userService } from '../services/userService';

export const useProfileStore = create<ProfileStore>((set) => ({
    userProfile: null,
    stats: {
        totalQuestions: 0,
        totalAnswers: 0,
        totalViews: 0,
        reputation: 0,
    },
    topQuestions: [],
    topAnswers: [],
    topTags: [],
    isLoading: false,
    error: null,
    latestViews: null,

    fetchUserProfile: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await userService.getUserProfile(userId);
            if (data.success) {
                set((state) => {
                    const user = data.user;
                    // Patch profileViews if we have a newer count from a concurrent increment
                    if (state.latestViews !== null && user?._id === userId && state.latestViews > user.profileViews) {
                        user.profileViews = state.latestViews;
                    }

                    return {
                        userProfile: user,
                        stats: data.stats,
                        topQuestions: data.topQuestions,
                        topAnswers: data.topAnswers,
                        topTags: data.topTags,
                        isLoading: false,
                        latestViews: null, // Reset after applying
                    };
                });
            } else {
                set({ error: data.message || "Failed to fetch profile", isLoading: false });
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Lỗi khi lấy thông tin người dùng",
                isLoading: false,
            });
        }
    },

    incrementProfileView: async (userId: string) => {
        try {
            const data = await userService.incrementProfileView(userId);
            if (data.success && data.profileViews !== undefined) {
                set((state) => {
                    const updates: any = { latestViews: data.profileViews };
                    if (state.userProfile && state.userProfile._id === userId) {
                        updates.userProfile = { ...state.userProfile, profileViews: data.profileViews };
                    }
                    return updates;
                });
            }
        } catch (error) {
            console.error("Lỗi khi update lượt view:", error);
        }
    },

    fetchTopAnswers: async (userId: string, sort: "votes" | "newest") => {
        try {
            const data = await userService.getUserAnswers(userId, 1, 3, sort);
            if (data.success) {
                set({ topAnswers: data.data });
            }
        } catch (error) {
            console.error("Lỗi khi fetch top answers:", error);
        }
    },

    updateProfileViews: (profileId: string, views: number) => {
        set((state) => {
            if (state.userProfile && state.userProfile._id === profileId) {
                return { userProfile: { ...state.userProfile, profileViews: views } };
            }
            return {};
        });
    }
}));
