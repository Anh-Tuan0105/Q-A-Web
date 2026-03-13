import { Link } from 'react-router';
import type { SimilarQuestion } from '../../services/similarityService';
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface SimilarQuestionsProps {
    suggestions: SimilarQuestion[];
    isChecking: boolean;
}

const SimilarityBadge = ({ score }: { score: number | null }) => {
    if (score === null) return null;
    const percent = Math.round(score * 100);
    const color = percent >= 90 ? 'text-red-600 bg-red-50 border-red-200'
        : percent >= 75 ? 'text-amber-600 bg-amber-50 border-amber-200'
        : 'text-blue-600 bg-blue-50 border-blue-200';
    return (
        <span className={`text-[11px] font-semibold border px-1.5 py-0.5 rounded-full shrink-0 ${color}`}>
            {percent}% giống
        </span>
    );
};

/**
 * Component hiển thị danh sách câu hỏi tương đồng khi người dùng đang soạn
 */
const SimilarQuestions = ({ suggestions, isChecking }: SimilarQuestionsProps) => {
    if (!isChecking && suggestions.length === 0) return null;

    return (
        <div className="mt-3 border border-amber-200 bg-amber-50 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-amber-200 bg-amber-100/50">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <span className="text-[13px] font-semibold text-amber-800">
                    Những câu hỏi tương tự đã tồn tại
                </span>
                {isChecking && <Loader2 size={13} className="ml-auto text-amber-500 animate-spin" />}
            </div>

            {/* Body */}
            {isChecking && suggestions.length === 0 ? (
                <div className="px-4 py-3 text-[13px] text-amber-600">Đang phân tích...</div>
            ) : (
                <ul className="divide-y divide-amber-100">
                    {suggestions.map((q) => (
                        <li key={q._id} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-amber-100/40 transition-colors">
                            <Link
                                to={`/questions/${q._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-slate-700 hover:text-blue-600 hover:underline line-clamp-1 flex-1 transition-colors"
                            >
                                {q.title}
                            </Link>
                            <div className="flex items-center gap-2 shrink-0">
                                <SimilarityBadge score={q.similarity} />
                                <ExternalLink size={13} className="text-slate-400" />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Footer hint */}
            {!isChecking && suggestions.length > 0 && (
                <div className="px-4 py-2 border-t border-amber-200 bg-amber-100/30">
                    <p className="text-[11px] text-amber-700">
                        Câu hỏi của bạn đã có câu trả lời chưa? Bạn có thể xem trước khi đăng mới.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SimilarQuestions;
