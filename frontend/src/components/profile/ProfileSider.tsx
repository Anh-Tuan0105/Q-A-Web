import { useNavigate, useLocation } from "react-router";
import { User, Lock } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";

const ProfileSider = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="w-full md:w-[280px] shrink-0 border-r border-blue-100/50 dark:border-[#334155] bg-[#FAFBFF]/30 dark:bg-[#1e293b]/30 min-h-[calc(100vh-64px)] py-8 px-6">
            <div className="flex flex-col">
                {/* User Profile Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-[#334155] flex-shrink-0">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${user?.displayName || user?.userName || "U"}&background=random`} alt="User Avatar" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 dark:text-[#f8fafc] text-[14px] leading-snug truncate">
                            {user?.displayName || "Nguyen Van A"}
                        </span>
                        <span className="text-slate-500 dark:text-[#94a3b8] text-[12px] truncate">
                            {user?.jobTitle || "Thành viên Cộng đồng"}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-2">
                    <div
                        onClick={() => navigate('/settings/profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[14px] transition-colors ${location.pathname === '/settings/profile' ? 'bg-[#F0F5FF] dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155]'
                            }`}
                    >
                        <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        Hồ Sơ Cá Nhân
                    </div>
                    <div
                        onClick={() => navigate('/security')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[14px] transition-colors ${location.pathname.startsWith('/security') ? 'bg-[#F0F5FF] dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155]'
                            }`}
                    >
                        <Lock className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        Bảo mật & Đăng nhập
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default ProfileSider;
