import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useQuestionDetailStore } from "../../stores/useQuestionDetailStore";
import { useAuthStore } from "../../stores/useAuthStore";
import Header from "../../components/header/Header";
import Sider from "../../components/sider/Sider";
import Footer from "../../components/footer/Footer";
import PopularTags from "../../components/popular-tags/PopularTags";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import MarkdownViewer from "../../components/markdown/MarkdownViewer";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useSocketStore } from "../../stores/useSocketStore";

// Tái sử dụng hàm helper từ Home
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

const QuestionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { question, answers, isLoading, fetchQuestionDetail, voteQuestion, voteAnswer, postAnswer, acceptAnswer } = useQuestionDetailStore();
    const { user } = useAuthStore();
    const { connect, joinRoom, leaveRoom, socket } = useSocketStore();
    const [answerContent, setAnswerContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mdeOptions = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: user ? "Viết câu trả lời của bạn ở đây..." : "Bạn cần đăng nhập để trả lời...",
            hideIcons: ["guide", "fullscreen", "side-by-side"],
            status: false
        } as any;
    }, [user]);

    const handleVoteQuestion = (value: 1 | -1) => {
        if (!user) {
            import('sonner').then(({ toast }) => toast.info("Bạn cần đăng nhập để bình chọn"));
            return;
        }
        if (question) {
            voteQuestion(question._id, value);
        }
    };

    const handleVoteAnswer = (answerId: string, value: 1 | -1) => {
        if (!user) {
            import('sonner').then(({ toast }) => toast.info("Bạn cần đăng nhập để bình chọn"));
            return;
        }
        voteAnswer(answerId, value);
    };

    const handlePostAnswer = async () => {
        if (!user) {
            import('sonner').then(({ toast }) => toast.info("Bạn cần đăng nhập để trả lời"));
            return;
        }
        if (!question?._id) return;

        if (!answerContent.trim()) {
            import('sonner').then(({ toast }) => toast.warning("Vui lòng nhập nội dung câu trả lời"));
            return;
        }

        setIsSubmitting(true);
        const success = await postAnswer(question._id, answerContent);
        if (success) {
            setAnswerContent("");
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        if (id) {
            fetchQuestionDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            if (!socket) {
                // Socket.io integration
                connect();
            }

            if (socket) {
                joinRoom(`room_question_${id}`);

                const handleNewAnswer = (newAnswer: any) => {
                    const { addAnswer } = useQuestionDetailStore.getState();
                    addAnswer(newAnswer);
                };

                // Nếu socket vừa mới kết nối/kết nối lại, gửi lệnh join_room
                const handleConnect = () => {
                    joinRoom(`room_question_${id}`);
                };

                socket.on("new_answer", handleNewAnswer);
                socket.on("connect", handleConnect);

                return () => {
                    socket.off("new_answer", handleNewAnswer);
                    socket.off("connect", handleConnect);
                    leaveRoom(`room_question_${id}`);
                };
            }
        }
    }, [id, socket]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col transition-colors">
                <Header />
                <div className="flex-1 max-w-[1400px] w-full mx-auto pt-6 flex justify-center items-center">
                    <span className="text-slate-500 dark:text-[#94a3b8] font-medium animate-pulse">Đang tải nội dung...</span>
                </div>
                <Footer />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col transition-colors">
                <Header />
                <div className="flex-1 max-w-[1400px] w-full mx-auto pt-6 flex justify-center items-center">
                    <span className="text-slate-500 dark:text-[#94a3b8] font-medium">Không tìm thấy câu hỏi hoặc câu hỏi đã bị xóa.</span>
                </div>
                <Footer />
            </div>
        );
    }

    const netVotes = question.upvoteCount - question.downvoteCount;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col">
            <Header />

            <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
                {/* Left Sider */}
                <Sider />

                {/* Main Content Area */}
                <div className="flex-1 ml-8 pr-8 pb-12 w-full flex gap-8">

                    {/* Middle Column (Question + Answers) */}
                    <main className="flex-1 max-w-4xl">

                        {/* Question Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-[28px] font-extrabold text-slate-800 dark:text-[#f8fafc] leading-tight pr-4 tracking-tight">
                                {question.title}
                            </h1>
                            {user ? (
                                <Link to="/ask" className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0 whitespace-nowrap cursor-pointer text-sm">
                                    + Đặt câu hỏi
                                </Link>
                            ) : (
                                <div className="flex gap-2 shrink-0">
                                    <Link to="/signin" className="px-4 py-2.5 bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500/50 font-bold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm whitespace-nowrap cursor-pointer text-sm">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/signup" className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap cursor-pointer text-sm">
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Question Stats */}
                        <div className="flex items-center gap-4 text-[13px] text-slate-500 dark:text-[#94a3b8] mb-6 pb-6 border-b border-slate-200 dark:border-[#334155]">
                            <div>Đã hỏi <span className="font-bold text-slate-700 dark:text-[#f8fafc]">{getRelativeTime(question.createdAt)}</span></div>
                            <div>Đã xem <span className="font-bold text-slate-700 dark:text-[#f8fafc]">{question.viewCount} lần</span></div>
                            <div>Hoạt động <span className="font-bold text-slate-700 dark:text-[#f8fafc]">{getRelativeTime(question.lastActivityAt)}</span></div>
                        </div>

                        {/* Question Body */}
                        <div className="flex gap-4 mb-8">
                            {/* Vote Column */}
                            <div className="flex flex-col items-center gap-2 shrink-0 w-12">
                                <button onClick={() => handleVoteQuestion(1)} className="p-2 text-slate-400 dark:text-[#94a3b8] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer">
                                    <ChevronUp className="w-8 h-8" />
                                </button>
                                <span className="font-bold text-[20px] text-slate-700 dark:text-[#f8fafc]">{netVotes}</span>
                                <button onClick={() => handleVoteQuestion(-1)} className="p-2 text-slate-400 dark:text-[#94a3b8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors mb-2 cursor-pointer">
                                    <ChevronDown className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 flex flex-col">
                                <MarkdownViewer content={question.content} className="mb-6 dark:prose-invert" />

                                {/* Tags */}
                                <div className="flex gap-2 flex-wrap mb-6">
                                    {question.tags.map(tag => (
                                        <Link key={tag._id} to={`/tags/${tag.name}`} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Author Card */}
                                <div className="flex items-start justify-between mt-auto">
                                    <div className="flex gap-4 text-[13px] text-slate-500 dark:text-[#94a3b8] font-bold">
                                        {user?._id === question.userId._id && (
                                            <>
                                                <button className="hover:text-slate-800 dark:hover:text-[#f8fafc] transition-colors cursor-pointer">Sửa</button>
                                                <button className="hover:text-slate-800 dark:hover:text-[#f8fafc] transition-colors cursor-pointer">Xóa</button>
                                            </>
                                        )}
                                    </div>

                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30 rounded-lg p-3 flex flex-col gap-2 min-w-[200px]">
                                        <div className="text-[12px] text-slate-500 dark:text-[#94a3b8] font-medium">đã hỏi {getRelativeTime(question.createdAt)}</div>
                                        <div className="flex items-center gap-2">
                                            <Link to={`/profile/${question.userId._id}`} className="hover:opacity-80 transition-opacity">
                                                <img
                                                    src={question.userId.avatarUrl || `https://ui-avatars.com/api/?name=${question.userId.displayName || question.userId.userName || "U"}&background=random`}
                                                    alt={question.userId.displayName || question.userId.userName}
                                                    className="w-8 h-8 rounded-md object-cover border border-blue-100 dark:border-blue-900/30"
                                                />
                                            </Link>
                                            <div className="flex flex-col">
                                                <Link to={`/profile/${question.userId._id}`} className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                                    {question.userId.displayName || question.userId.userName}
                                                </Link>
                                                <span className="text-[12px] font-bold text-slate-500 dark:text-[#94a3b8]">1.2k <span className="text-orange-400 ml-1">● 15</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Answers Section */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-bold text-slate-800 dark:text-[#f8fafc]">{answers.length} Câu trả lời</h2>
                            <div className="flex items-center gap-2 text-[14px]">
                                <span className="text-slate-500 dark:text-[#94a3b8] font-medium">Sắp xếp theo:</span>
                                <select className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-1.5 font-bold text-slate-700 dark:text-[#f8fafc] outline-none focus:border-blue-500">
                                    <option>Điểm số cao nhất</option>
                                    <option>Mới nhất</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mb-12">
                            {answers.map(answer => (
                                <div key={answer._id} className="flex gap-4 border-[2px] border-green-100/30 dark:border-green-900/20 p-[24px] rounded-[24px] bg-white dark:bg-[#1e293b]/50 shadow-sm">
                                    {/* Answer Vote Column */}
                                    <div className="flex flex-col items-center gap-2 shrink-0 w-12 pt-2">
                                        <button onClick={() => handleVoteAnswer(answer._id, 1)} className="p-2 text-slate-400 dark:text-[#94a3b8] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer">
                                            <ChevronUp className="w-8 h-8" />
                                        </button>
                                        <span className="font-bold text-[20px] text-slate-700 dark:text-[#f8fafc]">{answer.upvoteCount - answer.downvoteCount}</span>
                                        <button onClick={() => handleVoteAnswer(answer._id, -1)} className="p-2 text-slate-400 dark:text-[#94a3b8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors cursor-pointer">
                                            <ChevronDown className="w-8 h-8" />
                                        </button>
                                        {answer.isAccepted ? (
                                            user?._id === question.userId._id ? (
                                                <button
                                                    onClick={() => acceptAnswer(answer._id, question._id)}
                                                    className="mt-2 p-1.5 text-green-500 dark:text-green-400 hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#334155] rounded-full transition-all cursor-pointer"
                                                    title="Bỏ chấp nhận câu trả lời này"
                                                >
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </button>
                                            ) : (
                                                <span title="Câu trả lời được chấp nhận">
                                                    <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400 mt-2" />
                                                </span>
                                            )
                                        ) : (
                                            user?._id === question.userId._id && (
                                                <button
                                                    onClick={() => acceptAnswer(answer._id, question._id)}
                                                    className="mt-2 p-1.5 text-slate-300 dark:text-[#334155] hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-all cursor-pointer"
                                                    title="Chấp nhận câu trả lời này"
                                                >
                                                    <CheckCircle2 className="w-7 h-7" />
                                                </button>
                                            )
                                        )}
                                    </div>

                                    {/* Answer Content Column */}
                                    <div className="flex-1 flex flex-col pt-4">
                                        <MarkdownViewer content={answer.content} className="mb-6 dark:prose-invert" />

                                        <div className="flex items-start justify-between mt-auto">
                                            <div className="flex gap-4 text-[13px] text-slate-500 dark:text-[#94a3b8] font-bold">
                                                {user?._id === answer.userId._id && (
                                                    <>
                                                        <button className="hover:text-slate-800 dark:hover:text-[#f8fafc] transition-colors cursor-pointer">Sửa</button>
                                                        <button className="hover:text-slate-800 dark:hover:text-[#f8fafc] transition-colors cursor-pointer">Xóa</button>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link to={`/profile/${answer.userId._id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                                    <img
                                                        src={answer.userId.avatarUrl || `https://ui-avatars.com/api/?name=${answer.userId.displayName || answer.userId.userName || "U"}&background=random`}
                                                        alt={answer.userId.displayName || answer.userId.userName}
                                                        className="w-6 h-6 rounded-md object-cover border border-slate-100 dark:border-[#334155]"
                                                    />
                                                    <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                                        {answer.userId.displayName || answer.userId.userName}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Your Answer Input Area */}
                        <div className="mt-8 relative">
                            <h3 className="text-[20px] font-bold text-slate-800 dark:text-[#f8fafc] mb-4">Câu trả lời của bạn</h3>
                            <div className={`rounded-xl overflow-hidden mb-6 bg-white dark:bg-[#0f172a] transition-all prose-mde ${!user ? 'opacity-50 pointer-events-none select-none border border-slate-300 dark:border-[#334155]' : 'border border-slate-300 dark:border-[#334155] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`}>
                                <SimpleMdeReact
                                    value={answerContent}
                                    onChange={(val) => setAnswerContent(val)}
                                    options={mdeOptions}
                                />
                            </div>
                            {user ? (
                                <button
                                    onClick={handlePostAnswer}
                                    disabled={isSubmitting}
                                    className={`px-6 py-2.5 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isSubmitting ? "Đang đăng..." : "Đăng câu trả lời"}
                                </button>
                            ) : (
                                <div className="text-slate-600 dark:text-[#94a3b8] bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-4 rounded-xl flex items-center gap-4">
                                    <span className="font-medium text-sm">Vui lòng đăng nhập hoặc đăng ký để tham gia thảo luận.</span>
                                    <Link to="/signin" className="px-4 py-2 bg-white dark:bg-[#334155] text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500/50 font-bold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm cursor-pointer ml-auto text-sm">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer text-sm">
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>

                    </main>

                    {/* Right Sidebar (Tags) */}
                    <PopularTags className="sticky top-24" />

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default QuestionDetail;
