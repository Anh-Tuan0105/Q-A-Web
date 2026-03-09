import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';

const Header: React.FC = () => {
    const { user, logout } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate('/signin');
    };

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
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors select-none"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.displayName || user.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={`https://ui-avatars.com/api/?name=${user.displayName || user.userName || "U"}&background=random`} alt="User Avatar" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <span className="font-semibold text-slate-700 text-sm hidden sm:block">
                                        {user.displayName || user.userName}
                                    </span>
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 py-2 z-50">
                                        {/* User Info Header */}
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 mb-2">
                                            <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    (user.displayName || user.userName || 'U').substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex flex-col overflow-hidden leading-tight">
                                                <span className="font-bold text-slate-800 text-sm truncate">{user.displayName || user.userName}</span>
                                                <span className="text-slate-500 text-[13px] truncate">{user.email || 'user@dev.com'}</span>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <User className="w-[18px] h-[18px] text-blue-500" />
                                            <span className="font-medium">Hồ sơ cá nhân</span>
                                        </Link>

                                        <Link
                                            to="/settings/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Settings className="w-[18px] h-[18px] text-blue-500" />
                                            <span className="font-medium">Cài đặt</span>
                                        </Link>

                                        <div className="h-px bg-slate-100 my-2"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-[18px] h-[18px]" />
                                            <span className="font-medium">Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
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
