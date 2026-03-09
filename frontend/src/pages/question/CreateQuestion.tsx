import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useAuthStore } from "../../stores/useAuthStore";
import { questionService } from "../../services/questionService";
import { X } from "lucide-react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const CreateQuestion = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <div className="flex-1 max-w-[1000px] w-full mx-auto px-4 py-8">
                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold text-slate-800 mb-2">Đặt câu hỏi</h1>
                    <p className="text-slate-500 text-[15px]">
                        Mô tả vấn đề cụ thể và tưởng tượng bạn đang hỏi một người khác. Cộng đồng luôn sẵn sàng giúp đỡ!
                    </p>
                </div>

                {/* Form Container */}
                <div className="flex flex-col gap-6 mb-8">

                    {/* Title Block */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800 text-[16px]">Tiêu đề</h3>
                                <p className="text-[13px] text-slate-500">Hãy cụ thể và hình dung bạn đang hỏi một người khác.</p>
                            </div>
                            <span className="text-[12px] text-slate-400">Bắt buộc</span>
                        </div>
                        <input
                            type="text"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Ví dụ: Làm cách nào để chuyển đổi chuỗi thành số nguyên trong Python?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Content Block */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800 text-[16px]">Nội dung chi tiết</h3>
                                <p className="text-[13px] text-slate-500">Mô tả vấn đề của bạn, đoạn mã bị lỗi, và những gì bạn đã thử.</p>
                            </div>
                            <span className="text-[12px] text-slate-400">Hỗ trợ Markdown</span>
                        </div>

                        <div className="rounded-lg overflow-hidden border border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white prose-mde">
                            <SimpleMdeReact
                                value={content}
                                onChange={(val) => setContent(val)}
                                options={mdeOptions}
                            />
                        </div>
                    </div>

                    {/* Tags Block */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800 text-[16px]">Thẻ (Tags)</h3>
                                <p className="text-[13px] text-slate-500">Thêm tối đa 5 thẻ để mô tả nội dung câu hỏi của bạn.</p>
                            </div>
                            <span className="text-[12px] text-slate-400">Bắt buộc</span>
                        </div>

                        <div className="w-full border border-slate-300 rounded-lg px-2 py-2 flex items-center flex-wrap gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all min-h-[46px]">
                            {tags.map(tag => (
                                <div key={tag} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded bg-blue-100/50 text-[13px] font-medium border border-blue-200">
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="text-blue-400 hover:text-blue-700 hover:bg-blue-200 rounded-full p-0.5 transition-colors cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                className="flex-1 outline-none min-w-[150px] px-2 text-[15px] placeholder:text-slate-400"
                                placeholder={tags.length === 0 ? "Ví dụ: javascript, react, css..." : ""}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                disabled={isSubmitting || tags.length >= 5}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2.5 font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        disabled={isSubmitting}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handlePostQuestion}
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 font-bold text-white rounded-lg transition-colors shadow-sm cursor-pointer ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đăng câu hỏi"}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreateQuestion;
