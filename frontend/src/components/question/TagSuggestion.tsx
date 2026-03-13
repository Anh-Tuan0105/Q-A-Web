import { Sparkles, Plus } from "lucide-react";

interface TagSuggestionProps {
    tags: string[];
    isLoading: boolean;
    currentTags: string[];
    onSelectTag: (tag: string) => void;
}

const TagSuggestion = ({ tags, isLoading, currentTags, onSelectTag }: TagSuggestionProps) => {
    const availableTags = tags.filter((t) => !currentTags.includes(t));

    if (!isLoading && availableTags.length === 0) return null;

    return (
        <div className="mt-3 flex items-start gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium pt-0.5 shrink-0">
                <Sparkles size={13} className="text-blue-400" />
                <span>Gợi ý:</span>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-6 rounded-full bg-slate-100 animate-pulse"
                            style={{ width: `${52 + i * 14}px` }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => onSelectTag(tag)}
                            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-medium
                                       bg-blue-50 text-blue-600 border border-blue-200
                                       hover:bg-blue-100 hover:border-blue-400
                                       active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                            <Plus size={11} strokeWidth={2.5} />
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagSuggestion;
