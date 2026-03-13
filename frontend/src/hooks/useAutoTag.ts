import { useState, useEffect, useRef } from 'react';
import { tagService } from '../services/tagService';

const DEBOUNCE_DELAY = 800; // ms
const MIN_LENGTH = 5; // Ký tự tối thiểu để kích hoạt gợi ý

/**
 * Hook tự động gợi ý tags dựa trên title và body của câu hỏi.
 * Sử dụng debounce 800ms để tránh gọi API quá thường xuyên.
 */
export const useAutoTag = (title: string, body: string) => {
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();

        // Chỉ gợi ý khi có đủ nội dung
        if (trimmedTitle.length < MIN_LENGTH && trimmedBody.length < MIN_LENGTH) {
            setSuggestedTags([]);
            return;
        }

        timerRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const result = await tagService.suggestTags(trimmedTitle, trimmedBody);
                setSuggestedTags(result.tags);
            } catch {
                setSuggestedTags([]);
            } finally {
                setIsLoading(false);
            }
        }, DEBOUNCE_DELAY);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [title, body]);

    return { suggestedTags, isLoading };
};
