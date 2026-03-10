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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <div className="flex-1 max-w-[1240px] w-full mx-auto px-4 md:px-8 py-8 md:py-10">
                <ProfileHeader user={user} topTags={topTags} />

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Tất cả câu hỏi ({totalItems})</h2>
                            <p className="text-sm text-slate-500 mt-1">Danh sách các câu hỏi đã đăng tải</p>
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => { setSort("votes"); setPage(1); }}
                                className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${sort === 'votes' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Điểm cao nhất
                            </button>
                            <button
                                onClick={() => { setSort("newest"); setPage(1); }}
                                className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${sort === 'newest' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Mới nhất
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <Loading message="Đang tải danh sách..." />
                            </div>
                        ) : questions.length > 0 ? (
                            questions.map((ques) => (
                                <div key={ques._id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Stats Container - Desktop */}
                                        <div className="hidden md:flex flex-col gap-3 min-w-[100px] text-center">
                                            <div className="flex flex-col px-3 py-2 bg-slate-50 rounded-xl">
                                                <span className="text-lg font-bold text-slate-700">{ques.upvoteCount - ques.downvoteCount}</span>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase">votes</span>
                                            </div>
                                            <div className={`flex flex-col px-3 py-2 rounded-xl border ${ques.answersCount > 0 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                                                <span className="text-lg font-bold">{ques.answersCount}</span>
                                                <span className="text-[11px] font-bold uppercase">answers</span>
                                            </div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/questions/${ques._id}`} className="block mb-3">
                                                <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                                                    {ques.title}
                                                </h3>
                                            </Link>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {ques.tags?.map((tag: any) => (
                                                        <span key={tag._id} className="px-3 py-1 bg-blue-50/50 text-blue-600 text-[12px] font-bold rounded-lg border border-blue-100/50">
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                                                    <div className="flex items-center gap-1.5 md:hidden">
                                                        <span className="font-bold text-slate-600">{ques.upvoteCount - ques.downvoteCount}</span> votes
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-4 h-4" />
                                                        {ques.viewCount} views
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
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                                    <MessageSquare className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Chưa có câu hỏi nào</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mt-2">Người dùng này vẫn chưa đăng tải bất kỳ câu hỏi nào trên cộng đồng.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => setPage(idx + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl border font-bold text-sm transition-all shadow-sm ${page === idx + 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
