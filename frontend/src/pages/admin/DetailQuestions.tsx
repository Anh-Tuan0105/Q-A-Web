import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Search, Bell, Trash2, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { questionService } from '../../services/questionService';
import { toast } from 'sonner';

const DetailQuestions: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await questionService.getQuestionById(id);
                setQuestion(res.question);
            } catch (err) {
                toast.error('Không thể tải chi tiết câu hỏi');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [id]);

    const handleDelete = async () => {
        if (!id || !confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
        try {
            await questionService.deleteQuestion(id);
            toast.success('Đã xóa câu hỏi thành công');
            navigate('/admin/posts');
        } catch {
            toast.error('Xóa thất bại');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <RefreshCw size={32} className="animate-spin mb-4" />
                <p>Đang tải chi tiết...</p>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Không tìm thấy câu hỏi này.</p>
                <Link to="/admin/posts" className="text-blue-500 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Link to="/admin/posts" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <ArrowLeft size={20} />
                    </Link>
                    Chi tiết bài viết
                </h2>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-500 relative cursor-pointer">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8">
                {/* Tags */}
                <div className="flex gap-2">
                    {question.tags?.map((tag: any) => (
                        <span key={tag._id || tag} className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg tracking-wider">
                            {tag.name || tag}
                        </span>
                    ))}
                </div>

                {/* Title & Author */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">{question.title}</h1>
                    <div className="flex items-center gap-3">
                        <img
                            src={question.userId?.avatarUrl || `https://ui-avatars.com/api/?name=${question.userId?.displayName || 'U'}&background=random`}
                            alt={question.userId?.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{question.userId?.displayName || 'Ẩn danh'}</p>
                            <p className="text-xs text-gray-400">Đăng ngày {new Date(question.createdAt).toLocaleDateString('vi-VN')} • {question.views || 0} lượt xem</p>
                        </div>
                    </div>
                </div>

                {/* Post Body */}
                <div className="prose max-w-none text-gray-700 leading-relaxed text-sm">
                    <div dangerouslySetInnerHTML={{ __html: question.content }} />
                </div>
            </div>

            {/* Comments Section (Bản rút gọn cho Admin) */}
            <div className="space-y-4 pb-20">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={20} />
                    Thảo luận
                </h3>
                <p className="text-sm text-gray-500 italic">Quản trị viên có thể xem xét các bình luận trong trang chi tiết phía người dùng.</p>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-100 p-4 flex justify-center gap-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <button 
                    onClick={() => navigate('/admin/posts')}
                    className="px-8 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>
                <button 
                    onClick={handleDelete}
                    className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 flex items-center gap-2 cursor-pointer"
                >
                    <Trash2 size={18} />
                    Gỡ bỏ bài viết
                </button>
            </div>
        </div>
    );
};


export default DetailQuestions;
