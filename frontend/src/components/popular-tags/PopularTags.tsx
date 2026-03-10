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
            <div className={`bg-slate-50 border border-slate-100 shadow-sm rounded-xl p-6 ${className}`}>
                <h2 className="font-bold text-[17px] text-slate-800 mb-6">Tags phổ biến</h2>
                <div className="flex flex-col gap-4">
                    {popularTags.map(tag => (
                        <div key={tag._id} className="flex items-center justify-between">
                            <Link
                                to={`/questions?tag=${encodeURIComponent(tag.name)}`}
                                className="bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-full text-[13px] font-bold hover:border-slate-300 hover:shadow-sm transition-all"
                            >
                                {tag.name}
                            </Link>
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                                {tag.totalQuestion >= 1000 ? `${(tag.totalQuestion / 1000).toFixed(1)}k` : tag.totalQuestion} CÂU HỎI
                            </span>
                        </div>
                    ))}
                    {popularTags.length === 0 && (
                        <span className="text-sm text-slate-500 italic">Chưa có tag nào</span>
                    )}
                </div>
                <Link to="/tags" className="inline-block mt-8 text-[13px] font-bold text-blue-600 hover:underline">
                    Xem tất cả tags &rarr;
                </Link>
            </div>
        </aside>
    );
};

export default PopularTags;
