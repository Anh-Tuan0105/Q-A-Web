import { create } from 'zustand';
import { questionService } from '../services/questionService';
import { answerService } from '../services/answerService';
import type { QuestionType } from '../types/question';
import type { AnswerType } from '../types/answer';

interface QuestionDetailStore {
    question: QuestionType | null;
    answers: AnswerType[];
    isLoading: boolean;
    error: string | null;

    fetchQuestionDetail: (id: string) => Promise<void>;
    voteQuestion: (id: string, value: 1 | -1) => Promise<void>;
    voteAnswer: (id: string, value: 1 | -1) => Promise<void>;
    postAnswer: (quesId: string, content: string) => Promise<boolean>;
    acceptAnswer: (id: string, quesId: string) => Promise<void>;
}

export const useQuestionDetailStore = create<QuestionDetailStore>((set, get) => ({
    question: null,
    answers: [],
    isLoading: false,
    error: null,

    fetchQuestionDetail: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            // Fetch question and answers in parallel
            const [questionRes, answersRes] = await Promise.all([
                questionService.getQuestionById(id),
                answerService.getAnswersByQuestion(id)
            ]);

            if (questionRes.success) {
                set({ question: questionRes.question });
            } else {
                set({ error: "Failed to load question details" });
            }

            if (answersRes.success) {
                set({ answers: answersRes.answers });
            }

            set({ isLoading: false });

        } catch (error: any) {
            console.error("Error fetching question details:", error);
            set({
                error: error.response?.data?.message || "Lỗi tải dữ liệu câu hỏi",
                isLoading: false
            });
        }
    },

    voteQuestion: async (id: string, value: 1 | -1) => {
        try {
            const res = await questionService.voteQuestion(id, value);
            if (res.success && res.question) {
                const currentQuestion = get().question;
                if (currentQuestion) {
                    set({
                        question: {
                            ...currentQuestion,
                            upvoteCount: res.question.upvoteCount,
                            downvoteCount: res.question.downvoteCount
                        }
                    });
                }
            }
        } catch (error: any) {
            import('sonner').then(({ toast }) => {
                toast.error(error.response?.data?.message || "Lỗi khi vote câu hỏi");
            });
        }
    },

    voteAnswer: async (id: string, value: 1 | -1) => {
        try {
            const res = await answerService.voteAnswer(id, value);
            if (res.success && res.answer) {
                const { answers } = get();
                const updatedAnswers = answers.map((ans: AnswerType) =>
                    ans._id === id ? {
                        ...ans,
                        upvoteCount: res.answer.upvoteCount,
                        downvoteCount: res.answer.downvoteCount
                    } : ans
                );
                set({ answers: updatedAnswers });
            }
        } catch (error: any) {
            import('sonner').then(({ toast }) => {
                toast.error(error.response?.data?.message || "Lỗi khi vote câu trả lời");
            });
        }
    },

    postAnswer: async (quesId: string, content: string) => {
        try {
            set({ isLoading: true });
            const res = await answerService.createAnswer(quesId, content);
            if (res.success && res.answer) {
                // Populate the new answer with user data (basic mock using current user from AuthStore if needed, or simply re-fetch the answers list to get the fully populated user info from backend)
                // Re-fetching is safer to ensure correct structure
                const answersRes = await answerService.getAnswersByQuestion(quesId);
                if (answersRes.success) {
                    set({ answers: answersRes.answers });
                }

                // Update answersCount on question
                const currentQuestion = get().question;
                if (currentQuestion) {
                    set({
                        question: {
                            ...currentQuestion,
                            answersCount: currentQuestion.answersCount + 1
                        }
                    });
                }

                import('sonner').then(({ toast }) => {
                    toast.success(res.message || "Đăng câu trả lời thành công");
                });
                return true;
            }
            return false;
        } catch (error: any) {
            import('sonner').then(({ toast }) => {
                toast.error(error.response?.data?.message || "Lỗi khi đăng câu trả lời");
            });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    acceptAnswer: async (id: string, quesId: string) => {
        try {
            const res = await answerService.acceptAnswer(id, quesId);
            if (res.success) {
                // Re-fetch answers to get updated order (accepted answer comes first)
                const answersRes = await answerService.getAnswersByQuestion(quesId);
                if (answersRes.success) {
                    set({ answers: answersRes.answers });
                }

                // Update question status locally
                const currentQuestion = get().question;
                if (currentQuestion) {
                    set({
                        question: {
                            ...currentQuestion,
                            status: "resolved"
                        }
                    });
                }

                import('sonner').then(({ toast }) => {
                    toast.success(res.message || "Đã đánh dấu câu trả lời đúng");
                });
            }
        } catch (error: any) {
            import('sonner').then(({ toast }) => {
                toast.error(error.response?.data?.message || "Lỗi khi duyệt câu trả lời");
            });
        }
    }
}));
