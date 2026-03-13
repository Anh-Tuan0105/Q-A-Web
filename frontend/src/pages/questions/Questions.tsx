import { useState, useEffect } from "react";
import { useQuestionStore } from "../../stores/useQuestionStore";
import { useAuthStore } from "../../stores/useAuthStore";
import Header from "../../components/header/Header";
import Sider from "../../components/sider/Sider";
import Footer from "../../components/footer/Footer";
import PopularTags from "../../components/popular-tags/PopularTags";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { tagService } from "../../services/tagService";

// Helper function to format relative time
const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Hôm qua";
    if (diffInDays < 30) return `${diffInDays} ngày trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} năm trước`;
};

const TABS = [
    { id: "newest", label: "Mới nhất" },
    { id: "unanswered", label: "Chưa trả lời" },
    { id: "most-viewed", label: "Xem nhiều" },
    { id: "most-voted", label: "Bình chọn" },
];

const Questions = () => {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();
    const { questions, isLoading, activeTab, fetchQuestions, setActiveTab, currentPage, totalPages, setPage, totalQuestions } = useQuestionStore();
    const [searchParams] = useSearchParams();
    const tagQuery = searchParams.get("tag") || "";
    const [searchTag, setSearchTag] = useState(tagQuery);
    const [appliedTag, setAppliedTag] = useState(tagQuery);

    useEffect(() => {
        if (tagQuery) {
            setSearchTag(tagQuery);
            setAppliedTag(tagQuery);
            tagService.incrementTagView(tagQuery).catch((err) => console.error("Could not increment tag view", err));
        }
    }, [tagQuery]);

    useEffect(() => {
        fetchQuestions(currentPage, activeTab, appliedTag);
    }, [activeTab, currentPage, appliedTag]);

    const handleFilterTag = () => {
        setAppliedTag(searchTag);
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleFilterTag();
        }
    };

    const handleAskQuestion = () => {
        if (!user) {
            toast.info("Bạn cần đăng nhập để đặt câu hỏi");
            navigate('/signin');
            return;
        }
        navigate('/ask');
        toast.success("Chuyển đến trang đặt câu hỏi");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col">
            <Header />

            {/* Main Layout Container */}
            <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">

                {/* Sider Area */}
                <Sider />

                {/* Main Content Area */}
                <div className="flex-1 ml-8 pr-8 pb-12 w-full flex gap-8">
                    {/* Questions Column */}
                    <main className="flex-1 max-w-4xl">

                        {/* Top Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-[28px] font-extrabold text-[#282d33] dark:text-[#f8fafc] tracking-tight">Tất cả câu hỏi</h1>
                                <p className="text-slate-500 dark:text-[#94a3b8] text-[15px] font-medium mt-1">{totalQuestions.toLocaleString("vi-VN")} câu hỏi đã được đăng tải</p>
                            </div>
                            {user ? (
                                <button
                                    onClick={handleAskQuestion}
                                    className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                                >
                                    + Đặt câu hỏi
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/signin"
                                        className="px-4 py-2.5 text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors rounded-lg"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Filters Bar */}
                        <div className="flex flex-col gap-4 mb-6 bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-[#334155] rounded-xl p-4 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex gap-2">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2
                                                    ${activeTab === tab.id
                                                    ? "bg-slate-100 dark:bg-[#334155] text-slate-900 dark:text-[#f8fafc]"
                                                    : "text-slate-500 dark:text-[#94a3b8] hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-[#334155]/50"
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1 max-w-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-slate-400 dark:text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Lọc theo tag..."
                                        value={searchTag}
                                        onChange={(e) => setSearchTag(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="pl-9 pr-4 py-2 border border-slate-200 dark:border-[#334155] dark:bg-[#334155] rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-[#94a3b8] dark:text-[#f8fafc]"
                                    />
                                </div>
                                <button
                                    onClick={handleFilterTag}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Filter className="w-4 h-4" />
                                    Lọc
                                </button>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="flex flex-col gap-4">
                            {isLoading ? (
                                Array(4).fill(0).map((_, idx) => (
                                    <div key={idx} className="bg-white dark:bg-[#1e293b]/50 p-6 rounded-xl border border-slate-200 dark:border-[#334155] shadow-sm flex gap-6">
                                        <div className="flex flex-col items-end gap-3 shrink-0 w-[80px]">
                                            <Skeleton width={40} height={20} baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                            <Skeleton width={60} height={35} className="rounded-lg" baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                            <Skeleton width={50} height={15} baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <Skeleton width="80%" height={24} className="mb-2" baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                            <Skeleton count={2} className="mb-4" baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex gap-2">
                                                    <Skeleton width={50} height={24} borderRadius={12} baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                                    <Skeleton width={60} height={24} borderRadius={12} baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton circle width={24} height={24} baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                                    <Skeleton width={80} height={16} baseColor={document.documentElement.classList.contains('dark') ? '#27272a' : '#f3f4f6'} highlightColor={document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : questions.length === 0 ? (
                                <div className="flex justify-center py-10 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl">
                                    <span className="text-slate-500 dark:text-[#94a3b8] font-medium">Không tìm thấy câu hỏi nào.</span>
                                </div>
                            ) : questions.map((question) => {
                                const netVotes = question.upvoteCount - question.downvoteCount;
                                const isResolved = question.status === "resolved";

                                return (
                                    <div key={question._id} className="bg-white dark:bg-[#1e293b]/50 p-6 rounded-xl border border-slate-200 dark:border-[#334155] shadow-sm flex gap-6 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all hover:shadow-md">

                                        {/* Left Stats Column */}
                                        <div className="flex flex-col items-end gap-3 shrink-0 w-[80px]">
                                            <div className="flex flex-col items-end leading-none">
                                                <span className="font-bold text-[15px] text-slate-800 dark:text-[#f8fafc] pr-2">{netVotes}</span>
                                                <span className="text-[10px] text-slate-500 dark:text-[#94a3b8] font-bold uppercase mt-1.5 pr-2">PHIẾU</span>
                                            </div>
                                            <div className={`flex flex-col items-end py-1.5 px-2 rounded-lg border leading-none w-full text-right transition-colors
                                        ${isResolved ? "border-green-300 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                                                    question.answersCount > 0 ? "border-blue-300 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" :
                                                        "border-transparent text-slate-500 dark:text-[#94a3b8]"}
                                    `}>
                                                <span className="font-bold text-[15px]">{question.answersCount}</span>
                                                <span className="text-[9px] font-bold uppercase mt-1.5">TRẢ LỜI</span>
                                            </div>
                                            <div className="flex flex-col items-end leading-none mt-1">
                                                <span className="font-bold text-[15px] text-slate-500 dark:text-[#94a3b8] pr-2">{question.viewCount >= 1000 ? `${(question.viewCount / 1000).toFixed(1)}k` : question.viewCount}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-[#94a3b8] font-bold uppercase mt-1.5 pr-2">XEM</span>
                                            </div>
                                        </div>

                                        {/* Right Content Column */}
                                        <div className="flex flex-col flex-1">
                                            <Link to={`/questions/${question._id}`} className="text-[19px] font-bold text-slate-800 dark:text-[#f8fafc] hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug mb-2 pr-4 tracking-tight">
                                                {question.title}
                                            </Link>
                                            <p className="text-slate-600 dark:text-[#94a3b8] text-[14px] leading-relaxed mb-4 line-clamp-2">
                                                {question.content.replace(/[#*`>\[\]]/g, '')}
                                            </p>

                                            {/* Tags and Author */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex gap-2 flex-wrap">
                                                    {question.tags.map(tag => (
                                                        <Link key={tag._id} to={`/questions?tag=${encodeURIComponent(tag.name)}`} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                                            {tag.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm shrink-0 ml-4">
                                                    <Link to={`/profile/${question.userId._id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                                                        <img
                                                            src={question.userId.avatarUrl || `https://ui-avatars.com/api/?name=${question.userId.displayName || question.userId.userName || "U"}&background=random`}
                                                            alt={question.userId.displayName || question.userId.userName}
                                                            className="w-6 h-6 rounded-full object-cover border border-slate-100 dark:border-[#334155]"
                                                        />
                                                        <span className="font-bold text-slate-700 dark:text-[#f8fafc] text-[12px] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{question.userId.displayName || question.userId.userName}</span>
                                                    </Link>
                                                    <span className="text-slate-300 dark:text-[#334155]">|</span>
                                                    <span className="text-slate-500 dark:text-[#94a3b8] text-[12px]">{getRelativeTime(question.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 mb-8">
                                <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-1 shadow-sm">
                                    <button
                                        onClick={() => setPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 text-slate-400 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155] rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, index) => {
                                        const p = index + 1;
                                        if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`w-10 h-10 flex items-center justify-center font-bold rounded-lg transition-colors
                                                ${currentPage === p ? "bg-blue-600 text-white" : "text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155] cursor-pointer"}
                                            `}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        } else if (p === currentPage - 2 || p === currentPage + 2) {
                                            return <span key={p} className="w-10 h-10 flex items-center justify-center font-medium text-slate-400 dark:text-[#94a3b8]">...</span>
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => setPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155] rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </main>

                    {/* Right Sidebar */}
                    <PopularTags className="sticky top-25" />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Questions;
