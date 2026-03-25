import React, { useState } from 'react';
import { Flag, X, Loader2 } from 'lucide-react';
import { reportService } from '../../services/reportService';
import { toast } from 'sonner';

interface ReportDialogProps {
    targetId: string;
    contentType: 'Question' | 'Answer' | 'Comment';
    onClose: () => void;
}

const REPORT_REASONS = [
    'Spam hoặc quảng cáo',
    'Nội dung xúc phạm hoặc thù địch',
    'Thông tin sai lệch',
    'Vi phạm bản quyền',
    'Nội dung không phù hợp',
    'Khác',
];

const ReportDialog: React.FC<ReportDialogProps> = ({ targetId, contentType, onClose }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const finalReason = selectedReason === 'Khác' ? customReason.trim() : selectedReason;

    const handleSubmit = async () => {
        if (!finalReason) {
            toast.warning("Vui lòng chọn hoặc nhập lý do báo cáo");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await reportService.createReport(targetId, contentType, finalReason);
            if (res.success) {
                toast.success(res.message);
                onClose();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Lỗi khi gửi báo cáo";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contentLabel = { Question: 'câu hỏi', Answer: 'câu trả lời', Comment: 'bình luận' }[contentType];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-[#334155] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#334155]">
                    <div className="flex items-center gap-2">
                        <Flag size={18} className="text-red-500" />
                        <h3 className="text-[16px] font-bold text-slate-800 dark:text-[#f8fafc]">
                            Báo cáo {contentLabel}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-[#f8fafc] hover:bg-slate-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-3">
                    <p className="text-[13px] text-slate-500 dark:text-[#94a3b8]">
                        Chọn lý do bạn muốn báo cáo nội dung này:
                    </p>
                    <div className="flex flex-col gap-2">
                        {REPORT_REASONS.map((reason) => (
                            <label
                                key={reason}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all text-[14px] font-medium
                                    ${selectedReason === reason
                                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                        : 'border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#cbd5e1] hover:border-blue-300 dark:hover:border-blue-500/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="report-reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={() => setSelectedReason(reason)}
                                    className="accent-blue-600 w-4 h-4"
                                />
                                {reason}
                            </label>
                        ))}
                    </div>

                    {selectedReason === 'Khác' && (
                        <textarea
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Mô tả lý do cụ thể..."
                            maxLength={500}
                            rows={3}
                            className="mt-1 w-full px-3 py-2 text-[13px] border border-slate-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#0f172a] text-slate-800 dark:text-[#f8fafc] outline-none focus:border-blue-400 transition-colors resize-none"
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a]/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-bold text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] transition-colors cursor-pointer rounded-lg"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !finalReason}
                        className="px-5 py-2 text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
                        Gửi báo cáo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDialog;
