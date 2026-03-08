import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router';
import { useAuthStore } from '../../stores/useAuthStore';

const Header: React.FC = () => {
    const user = useAuthStore((s) => s.user);

    return (
        <header className="bg-white border-b border-gray-100 py-3 flex items-center justify-center sticky top-0 z-50">
            {/* Main Wrapper matching the layout width */}
            <div className="flex items-center w-full max-w-[1400px]">
                {/* Combined Logo and Search Bar Area */}
                <div className="flex items-center gap-8 ml-8 flex-1">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 shrink-0 cursor-pointer">
                        <img src="/logo.svg" alt="DevCommunity Logo" className="w-[28px] h-[28px]" />
                        <span className="text-[20px] font-bold text-slate-800">DevCommunity</span>
                    </div>

                    {/* Search Bar Section */}
                    <div className="w-[384px] shrink-0">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm câu hỏi, tags..."
                                className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-6 mr-8">
                    {user ? (
                        <>
                            {/* Notification */}
                            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>

                            {/* Divider */}
                            <div className="h-8 w-px bg-slate-200"></div>

                            {/* Profile */}
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`} alt="User Avatar" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <span className="font-semibold text-slate-700 text-sm hidden sm:block">
                                    {user.displayName}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/signin" className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                Đăng nhập
                            </Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
