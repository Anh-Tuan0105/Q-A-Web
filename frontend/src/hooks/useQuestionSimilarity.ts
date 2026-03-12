import { useState, useEffect, useRef } from 'react';
import { similarityService, type SimilarQuestion } from '../services/similarityService';

const DEBOUNCE_DELAY = 700; // ms - chờ người dùng ngừng gõ
const MIN_TITLE_LENGTH = 10; // ký tự tối thiểu để kích hoạt tìm kiếm

/**
 * Custom hook quản lý việc tìm kiếm câu hỏi tương đồng theo real-time (debounced)
 * @param title - Tiêu đề câu hỏi người dùng đang nhập
 * @param excludeId - ID câu hỏi cần loại trừ (khi chỉnh sửa)
 */
export const useQuestionSimilarity = (title: string, excludeId?: string) => {
    const [suggestions, setSuggestions] = useState<SimilarQuestion[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastCheckedTitle = useRef<string>('');

    useEffect(() => {
        // Xoá timer cũ trước khi tạo mới
        if (timerRef.current) clearTimeout(timerRef.current);

        const trimmed = title.trim();

        // Reset nếu tiêu đề quá ngắn
        if (trimmed.length < MIN_TITLE_LENGTH) {
            setSuggestions([]);
            setIsChecking(false);
            return;
        }

        // Không gọi lại nếu tiêu đề giống lần trước
        if (trimmed === lastCheckedTitle.current) return;

        // Debounce: chờ người dùng ngừng gõ
        timerRef.current = setTimeout(async () => {
            setIsChecking(true);
            lastCheckedTitle.current = trimmed;
            try {
                const results = await similarityService.findSimilarQuestions(trimmed, excludeId);
                setSuggestions(results);
            } catch (error) {
                // Silent fail - tính năng này không nên block người dùng
                setSuggestions([]);
            } finally {
                setIsChecking(false);
            }
        }, DEBOUNCE_DELAY);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [title, excludeId]);

    return { suggestions, isChecking };
};
