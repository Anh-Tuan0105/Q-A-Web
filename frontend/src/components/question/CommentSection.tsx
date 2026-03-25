import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, Trash2, Send, Loader2, Edit2, X, Check, AlertTriangle } from 'lucide-react';
import { type Comment } from '../../services/commentService';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCommentReportStore } from '../../stores/useCommentReportStore';
import { toast } from 'sonner';
import { Link } from 'react-router';
import ReportDialog from './ReportDialog';

interface CommentSectionProps {
    targetType: 'Question' | 'Answer';
    targetId: string;
    /** Socket event để lắng nghe comment mới và comment bị ẩn */
    socket?: any;
}

const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 60) return "Vừa xong";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} giờ trước`;
    return `${Math.floor(diffHr / 24)} ngày trước`;
};

const CommentSection: React.FC<CommentSectionProps> = ({ targetType, targetId, socket }) => {
    const { user } = useAuthStore();
    const { 
        commentsByTarget, 
        fetchComments, 
        addComment, 
        updateComment, 
        deleteComment: storeDeleteComment,
        receiveNewComment,
        removeHiddenComment
    } = useCommentReportStore();

    const comments = commentsByTarget[targetId] || [];

    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInput, setShowInput] = useState(false);
    
    // For editing
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isEditingSubmit, setIsEditingSubmit] = useState(false);
    const editInputRef = useRef<HTMLInputElement>(null);

    // Report state
    const [reportCommentId, setReportCommentId] = useState<string | null>(null);

    useEffect(() => {
        if (!commentsByTarget[targetId]) {
            fetchComments(targetType, targetId);
        }
    }, [targetId, targetType, fetchComments, commentsByTarget]);

    // Lắng nghe realtime events từ socket
    useEffect(() => {
        if (!socket) return;

        const handleNewComment = (comment: Comment) => {
            if (comment.targetId === targetId && comment.targetType === targetType) {
                receiveNewComment(targetId, comment);
            }
        };

        const handleCommentHidden = ({ commentId }: { commentId: string }) => {
            removeHiddenComment(targetId, commentId);
        };

        socket.on('new_comment', handleNewComment);
        socket.on('comment_hidden', handleCommentHidden);

        return () => {
            socket.off('new_comment', handleNewComment);
            socket.off('comment_hidden', handleCommentHidden);
        };
    }, [socket, targetId, targetType, receiveNewComment, removeHiddenComment]);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        if (!user) {
            toast.info("Bạn cần đăng nhập để bình luận");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await addComment(targetType, targetId, content);
            // Bình luận bị gắn cờ → hiển thị thông báo chờ duyệt qua Toast
            if (res.pending) {
                toast.info(res.message, { duration: 5000 });
                setContent('');
                setShowInput(false);
                return;
            }
            if (res.success) {
                setContent('');
                setShowInput(false);
                // Comment sạch được thêm qua socket realtime (hoặc qua data trả về nếu xử lý đồng bộ)
            }
        } catch (err: any) {
            const msg = err.response?.data?.message;
            toast.error(msg || "Không thể đăng bình luận");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async (commentId: string) => {
        if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        try {
            await storeDeleteComment(targetId, commentId);
        } catch {
            // Error is handled in store
        }
    };

    const handleEditStart = (comment: Comment) => {
        setEditingCommentId(comment._id);
        setEditContent(comment.content);
        setTimeout(() => editInputRef.current?.focus(), 0);
    };

    const handleEditSubmit = async (commentId: string) => {
        if (!editContent.trim()) return;
        setIsEditingSubmit(true);
        try {
            await updateComment(targetId, commentId, editContent);
            setEditingCommentId(null);
            setEditContent('');
            toast.success("Đã cập nhật bình luận");
        } catch (err: any) {
             // Error handled in store
        } finally {
            setIsEditingSubmit(false);
        }
    };

    return (
        <div className="mt-3 border-t border-slate-100 dark:border-[#334155]/50 pt-2">
            {/* Danh sách comment */}
            {comments.map(comment => (
                <div key={comment._id} className="flex items-start gap-2 py-1.5 group text-[13px] text-slate-600 dark:text-[#94a3b8] border-b border-slate-50 dark:border-[#334155]/30 last:border-0 relative">
                    <img
                        src={comment.userId.avatarUrl || `https://ui-avatars.com/api/?name=${comment.userId.displayName}&background=random`}
                        alt={comment.userId.displayName}
                        className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0 pr-12">
                        {editingCommentId === comment._id ? (
                            <div className="flex items-center gap-2 mb-1 w-full relative z-10">
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isEditingSubmit) handleEditSubmit(comment._id);
                                        if (e.key === 'Escape') { setEditingCommentId(null); setEditContent(''); }
                                    }}
                                    className="flex-1 px-2 py-1 text-[13px] border border-blue-300 dark:border-blue-500 rounded bg-white dark:bg-[#0f172a] text-slate-800 dark:text-[#f8fafc] outline-none"
                                    disabled={isEditingSubmit}
                                />
                                <div className="flex gap-1 shrink-0">
                                     <button onClick={() => handleEditSubmit(comment._id)} disabled={isEditingSubmit || !editContent.trim()} className="text-blue-500 p-1 hover:bg-blue-50 rounded cursor-pointer disabled:opacity-50">
                                        <Check size={14} /> 
                                     </button>
                                     <button onClick={() => { setEditingCommentId(null); setEditContent(''); }} className="text-slate-400 p-1 hover:bg-slate-50 rounded cursor-pointer">
                                        <X size={14} />
                                     </button>
                                </div>
                            </div>
                        ) : (
                            <span className="text-slate-700 dark:text-[#cbd5e1]">{comment.content}</span>
                        )}
                        <span className="mx-1.5 text-slate-300 dark:text-[#334155]">–</span>
                        <Link to={`/profile/${comment.userId._id}`} className="text-blue-500 font-semibold hover:underline">
                            {comment.userId.displayName || comment.userId.userName}
                        </Link>
                        <span className="ml-2 text-slate-400 dark:text-[#64748b] text-[11px]">{getRelativeTime(comment.createdAt)}</span>
                    </div>

                    {/* Owner or Admin actions */}
                    {(user?._id === comment.userId._id || user?.role === 'admin') && editingCommentId !== comment._id && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all bg-white dark:bg-[#1e293b]/50 absolute right-0 top-1 p-0.5 rounded shadow-sm border border-slate-100 dark:border-[#334155]">
                             <button
                                onClick={() => handleEditStart(comment)}
                                className="p-1 text-slate-400 hover:text-blue-500 transition-colors rounded cursor-pointer shrink-0"
                                title="Sửa"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button
                                onClick={() => handleDelete(comment._id)}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded cursor-pointer shrink-0"
                                title="Xóa"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}

                    {/* Report button for non-owners */}
                    {user && user._id !== comment.userId._id && user?.role !== 'admin' && editingCommentId !== comment._id && (
                        <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-1 transition-all">
                            <button
                                onClick={() => setReportCommentId(comment._id)}
                                className="p-1 text-slate-400 hover:text-orange-500 transition-colors rounded cursor-pointer"
                                title="Báo cáo bình luận"
                            >
                                <AlertTriangle size={12} />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Footer: Toggle input & đếm comment */}
            {user ? (
                <div className="mt-1.5">
                    {!showInput ? (
                        <button
                            onClick={() => setShowInput(true)}
                            className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                            <MessageCircle size={13} />
                            Thêm bình luận
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="text"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !isSubmitting && handleSubmit()}
                                placeholder="Bình luận ngắn... (Enter để gửi)"
                                maxLength={600}
                                autoFocus
                                className="flex-1 px-3 py-1.5 text-[13px] border border-slate-200 dark:border-[#334155] rounded-lg bg-white dark:bg-[#0f172a] text-slate-800 dark:text-[#f8fafc] outline-none focus:border-blue-400 transition-colors"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !content.trim()}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </button>
                            <button
                                onClick={() => { setShowInput(false); setContent(''); }}
                                className="text-[12px] text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                comments.length === 0 ? null : (
                    <Link to="/signin" className="mt-1.5 flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-500 transition-colors">
                        <MessageCircle size={13} />
                        Đăng nhập để bình luận
                    </Link>
                )
            )}
            {/* Report Dialog for Comment */}
            {reportCommentId && (
                <ReportDialog
                    targetId={reportCommentId}
                    contentType="Comment"
                    onClose={() => setReportCommentId(null)}
                />
            )}
        </div>
    );
};

export default CommentSection;
