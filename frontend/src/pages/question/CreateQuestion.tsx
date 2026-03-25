import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useAuthStore } from "../../stores/useAuthStore";
import { questionService } from "../../services/questionService";
import { X, Loader2 } from "lucide-react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useQuestionSimilarity } from "../../hooks/useQuestionSimilarity";
import SimilarQuestions from "../../components/question/SimilarQuestions";
import { useAutoTag } from "../../hooks/useAutoTag";
import TagSuggestion from "../../components/question/TagSuggestion";

const CreateQuestion = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI Similarity check
    const { suggestions, isChecking } = useQuestionSimilarity(title);

    // Auto-tagging
    const { suggestedTags, isLoading: isTagLoading } = useAutoTag(title, content);

    const handleSuggestTagSelect = (tag: string) => {
        if (tags.includes(tag) || tags.length >= 5) return;
        setTags([...tags, tag]);
    };

    const mdeOptions = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: "Viết câu hỏi của bạn ở đây...",
            hideIcons: ["guide", "fullscreen", "side-by-side"],
            status: false
        } as any;
    }, []);

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (newTag && !tags.includes(newTag)) {
                if (tags.length >= 5) {
                    import('sonner').then(({ toast }) => toast.warning("Bạn chỉ có thể thêm tối đa 5 thẻ"));
                    return;
                }
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handlePostQuestion = async () => {
        if (!user) {
            import('sonner').then(({ toast }) => toast.info("Bạn cần đăng nhập để đặt câu hỏi"));
            navigate("/signin");
            return;
        }
        if (!title.trim() || !content.trim() || tags.length === 0) {
            import('sonner').then(({ toast }) => toast.warning("Vui lòng điền đầy đủ tiêu đề, nội dung và ít nhất 1 thẻ"));
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await questionService.createQuestion(title, content, tags);
            // Bài đăng bị gắn cờ → thông báo và về trang chủ
            if (res.pending) {
                import('sonner').then(({ toast }) => toast.info(res.message, { duration: 5000 }));
                navigate("/");
                return;
            }
            if (res.success && res.question) {
                import('sonner').then(({ toast }) => toast.success("Đăng câu hỏi thành công!"));
                navigate(`/questions/${res.question._id}`);
            }
        } catch (error: any) {
            import('sonner').then(({ toast }) => toast.error(error.response?.data?.message || "Lỗi khi đăng câu hỏi"));
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col">
            <Header />
            <div className="flex-1 max-w-[1000px] w-full mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-[32px] font-extrabold text-slate-800 dark:text-[#f8fafc] mb-2 tracking-tight">Đặt câu hỏi</h1>
                    <p className="text-slate-500 dark:text-[#94a3b8] text-[15px] font-medium">
                        Mô tả vấn đề cụ thể và tưởng tượng bạn đang hỏi một người khác. Cộng đồng luôn sẵn sàng giúp đỡ!
                    </p>
                </div>

                <div className="flex flex-col gap-6 mb-8">
                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-[#f8fafc] text-[16px]">Tiêu đề</h3>
                                <p className="text-[13px] text-slate-500 dark:text-[#94a3b8]">Hãy cụ thể và hình dung bạn đang hỏi một người khác.</p>
                            </div>
                            <span className="text-[12px] text-slate-400 dark:text-[#94a3b8] font-bold uppercase">Bắt buộc</span>
                        </div>
                        <input
                            type="text"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Ví dụ: Làm cách nào để chuyển đổi chuỗi thành số nguyên trong Python?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {/* AI Similarity suggestions */}
                        <SimilarQuestions suggestions={suggestions} isChecking={isChecking} />
                    </div>
                    {/* Content Block */}
                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-[#f8fafc] text-[16px]">Nội dung chi tiết</h3>
                                <p className="text-[13px] text-slate-500 dark:text-[#94a3b8]">Mô tả vấn đề của bạn, đoạn mã bị lỗi, và những gì bạn đã thử.</p>
                            </div>
                            <span className="text-[12px] text-slate-400 dark:text-[#94a3b8] font-bold uppercase">Markdown</span>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-[#334155] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white dark:bg-[#0f172a] prose-mde">
                            <SimpleMdeReact value={content} onChange={(val) => setContent(val)} options={mdeOptions} />
                        </div>
                    </div>
                    {/* Tags Block */}
                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-[#f8fafc] text-[16px]">Thẻ (Tags)</h3>
                                <p className="text-[13px] text-slate-500 dark:text-[#94a3b8]">Thêm tối đa 5 thẻ để mô tả nội dung câu hỏi của bạn.</p>
                            </div>
                            <span className="text-[12px] text-slate-400 dark:text-[#94a3b8] font-bold uppercase">Bắt buộc</span>
                        </div>
                        <div className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#334155] rounded-lg px-2 py-2 flex items-center flex-wrap gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all min-h-[46px]">
                            {tags.map(tag => (
                                <div key={tag} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[13px] font-bold border border-blue-200 dark:border-blue-800">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="text-blue-400 dark:text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full p-0.5 transition-colors cursor-pointer"><X size={14} /></button>
                                </div>
                            ))}
                            <input type="text" className="flex-1 bg-transparent outline-none min-w-[150px] px-2 text-[15px] dark:text-[#f8fafc] placeholder:text-slate-400 dark:placeholder:text-[#94a3b8]" placeholder={tags.length === 0 ? "Ví dụ: javascript, react, css..." : ""} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} disabled={isSubmitting || tags.length >= 5} />
                        </div>
                        <TagSuggestion
                            tags={suggestedTags}
                            isLoading={isTagLoading}
                            currentTags={tags}
                            onSelectTag={handleSuggestTagSelect}
                        />
                    </div>
                    </div>
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="px-4 py-2.5 font-bold text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] transition-colors cursor-pointer" disabled={isSubmitting}>Hủy bỏ</button>
                    <button onClick={handlePostQuestion} disabled={isSubmitting} className={`px-8 py-2.5 font-bold text-white rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng câu hỏi"}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateQuestion;
