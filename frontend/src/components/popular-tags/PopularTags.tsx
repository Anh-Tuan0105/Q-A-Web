import { Link } from "react-router";
import { useEffect } from "react";
import { useTagStore } from "../../stores/useTagStore";

interface PopularTagsProps {
    className?: string;
}

const PopularTags = ({ className = "sticky top-6" }: PopularTagsProps) => {
    const { popularTags, fetchPopularTags } = useTagStore();

    useEffect(() => {
        fetchPopularTags();
    }, []);

    return (
        <aside className="w-[300px] shrink-0">
            <div className={`bg-slate-50 dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] shadow-sm rounded-xl p-6 ${className}`}>
                <h2 className="font-bold text-[17px] text-slate-800 dark:text-[#f8fafc] mb-6 tracking-tight">Tags phổ biến</h2>
                <div className="flex flex-col gap-4">
                    {popularTags.map(tag => (
                        <div key={tag._id} className="flex items-center justify-between">
                            <Link
                                to={`/questions?tag=${encodeURIComponent(tag.name)}`}
                                className="bg-white dark:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-800 dark:text-[#f8fafc] px-3 py-1.5 rounded-full text-[13px] font-bold hover:border-slate-300 dark:hover:border-blue-500/50 hover:shadow-sm transition-all"
                            >
                                {tag.name}
                            </Link>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-[#94a3b8] uppercase">
                                {tag.totalQuestion >= 1000 ? `${(tag.totalQuestion / 1000).toFixed(1)}k` : tag.totalQuestion} CÂU HỎI
                            </span>
                        </div>
                    ))}
                    {popularTags.length === 0 && (
                        <span className="text-sm text-slate-500 dark:text-[#94a3b8] italic">Chưa có tag nào</span>
                    )}
                </div>
                <Link to="/tags" className="inline-block mt-8 text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Xem tất cả tags &rarr;
                </Link>
            </div>
        </aside>
    );
};

export default PopularTags;
