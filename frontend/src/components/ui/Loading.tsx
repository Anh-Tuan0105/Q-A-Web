import { Loader2 } from "lucide-react";

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
}

const Loading = ({ message = "Đang tải dữ liệu...", fullScreen = false }: LoadingProps) => {
    const content = (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-4">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" strokeWidth={2.5} />
            </div>
            <p className="text-slate-500 font-bold animate-pulse text-[15px]">{message}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export default Loading;
