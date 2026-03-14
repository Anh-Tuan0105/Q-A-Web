import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Header from "../../components/header/Header";
import ProfileHeader from "../../components/profile/ProfileHeader";
import Loading from "../../components/ui/Loading";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { userService } from "../../services/userService";
import { MessageSquare, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const UserQuestions = () => {
    const { id } = useParams<{ id: string }>();
    const currentUser = useAuthStore((s) => s.user);
    const { userProfile, fetchUserProfile, topTags } = useProfileStore();

    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sort, setSort] = useState<"newest" | "votes">("newest");

    const profileUserId = id || currentUser?._id;

    useEffect(() => {
        if (profileUserId) {
            fetchUserProfile(profileUserId);
        }
    }, [profileUserId, fetchUserProfile]);

    useEffect(() => {
        const loadQuestions = async () => {
            if (!profileUserId) return;
            setIsLoading(true);
            try {
                const res = await userService.getUserQuestions(profileUserId, page, 10, sort);
                if (res.success) {
                    setQuestions(res.data);
                    setTotalPages(res.pagination.totalPages);
                    setTotalItems(res.pagination.totalItems);
                }
            } catch (error) {
                console.error("Lỗi tải câu hỏi:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestions();
    }, [profileUserId, page, sort]);

    if (!userProfile && isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading />
                </div>
            </div>
        );
    }

    const user = userProfile || currentUser;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col">
            <Header />
            <div className="flex-1 max-w-[1240px] w-full mx-auto px-4 md:px-8 py-8 md:py-10">
                <ProfileHeader user={user} topTags={topTags} />

                <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight">Tất cả câu hỏi ({totalItems})</h2>
                            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1 font-medium">Danh sách các câu hỏi đã đăng tải</p>
                        </div>

                        <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => { setSort("votes"); setPage(1); }}
                                className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${sort === 'votes' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                            >
                                Điểm cao nhất
                            </button>
                            <button
                                onClick={() => { setSort("newest"); setPage(1); }}
                                className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${sort === 'newest' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                            >
                                Mới nhất
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <Loading message="Đang tải danh sách..." />
                            </div>
                        ) : questions.length > 0 ? (
                            questions.map((ques) => (
                                <div key={ques._id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Stats Container - Desktop */}
                                        <div className="hidden md:flex flex-col gap-3 min-w-[100px] text-center">
                                            <div className="flex flex-col px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 rounded-xl leading-snug">
                                                <span className="text-lg font-bold text-slate-700 dark:text-zinc-200">{ques.upvoteCount - ques.downvoteCount}</span>
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase">VOTES</span>
                                            </div>
                                            <div className={`flex flex-col px-3 py-2 rounded-xl border leading-snug transition-colors ${ques.answersCount > 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'}`}>
                                                <span className="text-lg font-bold">{ques.answersCount}</span>
                                                <span className="text-[10px] font-bold uppercase">ANSWERS</span>
                                            </div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/questions/${ques._id}`} className="block mb-3">
                                                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-zinc-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                                                    {ques.title}
                                                </h3>
                                            </Link>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {ques.tags?.map((tag: any) => (
                                                        <span key={tag._id} className="px-3 py-1 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-4 text-slate-400 dark:text-zinc-600 text-[13px] font-bold">
                                                    <div className="flex items-center gap-1.5 md:hidden">
                                                        <span className="font-bold text-slate-600 dark:text-zinc-400">{ques.upvoteCount - ques.downvoteCount}</span> votes
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-4 h-4" />
                                                        {ques.viewCount >= 1000 ? `${(ques.viewCount / 1000).toFixed(1)}k` : ques.viewCount} views
                                                    </div>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>Đã hỏi {new Date(ques.createdAt).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-2xl mb-4">
                                    <MessageSquare className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Chưa có câu hỏi nào</h3>
                                <p className="text-slate-500 dark:text-zinc-500 max-w-xs mx-auto mt-2 font-medium">Người dùng này vẫn chưa đăng tải bất kỳ câu hỏi nào trên cộng đồng.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => setPage(idx + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl border font-bold text-sm transition-all shadow-sm ${page === idx + 1 ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserQuestions;
