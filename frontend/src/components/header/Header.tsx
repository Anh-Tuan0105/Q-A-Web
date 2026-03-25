import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { questionService } from '../../services/questionService';
import type { QuestionType } from '../../types/question';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useSocketStore } from '../../stores/useSocketStore';
import { useAdminSettingsStore } from '../../stores/useAdminSettingsStore';

const Header: React.FC = () => {
    const { user, logout, accessToken } = useAuthStore();
    const logoUrl = useAdminSettingsStore((s) => s.logoUrl);
    const siteName = useAdminSettingsStore((s) => s.siteName);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifDropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const userNameDisplay = user?.displayName || user?.userName;
    const userAvatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(userNameDisplay || "U")}&background=random`;

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [searchResults, setSearchResults] = useState<QuestionType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch search results
    useEffect(() => {
        const fetchSearch = async () => {
            if (!debouncedTerm.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const data = await questionService.searchQuestions(debouncedTerm);
                if (data.success) {
                    setSearchResults(data.questions);
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };
        fetchSearch();
    }, [debouncedTerm]);
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
    const { socket } = useSocketStore();

    useEffect(() => {
        if (user && accessToken) {
            fetchNotifications();
        }
    }, [user, accessToken, fetchNotifications]);

    useEffect(() => {
        if (socket) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handleNewNotification = (notification: any) => {
                useNotificationStore.getState().addNotification(notification);
            };
            socket.on("new_notification", handleNewNotification);

            return () => {
                socket.off("new_notification", handleNewNotification);
            };
        }
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
            if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
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
        <header className="bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-100 dark:border-[#334155] py-3 flex items-center justify-center sticky top-0 z-50">
            {/* Main Wrapper matching the layout width */}
            <div className="flex items-center w-full max-w-[1400px]">
                {/* Combined Logo and Search Bar Area */}
                <div className="flex items-center gap-8 ml-8 flex-1">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
                        <img src={logoUrl} alt={`${siteName} Logo`} className="w-[28px] h-[28px] object-cover dark:invert-[0.1]" />
                        <span className="text-[20px] font-bold text-slate-800 dark:text-[#f8fafc]">{siteName}</span>
                    </Link>

                    {/* Search Bar Section */}
                    <div className="relative w-[384px] shrink-0" ref={searchRef}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94a3b8] w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                placeholder="Tìm kiếm câu hỏi, tags..."
                                className="w-full bg-slate-50 dark:bg-[#1e293b] border-none dark:border dark:border-[#334155] rounded-full py-2.5 pl-12 pr-10 text-sm focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 focus:bg-white dark:focus:bg-[#334155] transition-all outline-none dark:text-[#f8fafc]"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
                            )}
                        </div>

                        {/* Search Dropdown */}
                        {isSearchOpen && searchTerm.trim() !== '' && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-[#334155] py-2 z-50 overflow-hidden flex flex-col max-h-[400px]">
                                {isSearching && searchResults.length === 0 ? (
                                    <div className="px-4 py-4 text-sm text-slate-500 dark:text-[#94a3b8] text-center">Đang tìm kiếm...</div>
                                ) : searchResults.length > 0 ? (
                                    <div className="overflow-y-auto">
                                        <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-[#94a3b8] uppercase tracking-wider bg-slate-50 dark:bg-[#334155]/50 border-b border-slate-100 dark:border-[#334155] mb-1">
                                            Câu hỏi liên quan
                                        </div>
                                        {searchResults.map((q) => (
                                            <Link
                                                key={q._id}
                                                to={`/questions/${q._id}`}
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    setSearchTerm("");
                                                }}
                                                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors flex flex-col gap-1.5 border-b border-slate-50 dark:border-[#334155] last:border-0"
                                            >
                                                <span className="text-sm font-bold text-slate-700 dark:text-[#f8fafc] line-clamp-2 leading-snug">{q.title}</span>
                                                <div className="flex items-center gap-3 text-[12px] text-slate-500 dark:text-[#94a3b8] mt-1">
                                                    <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-[#334155] px-2 py-0.5 rounded-full"><span className="text-blue-600 dark:text-blue-400 font-bold">{q.upvoteCount - q.downvoteCount}</span> phiếu</span>
                                                    <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-[#334155] px-2 py-0.5 rounded-full"><span className={q.answersCount > 0 ? "text-green-600 dark:text-green-400 font-bold" : "text-slate-500 dark:text-[#94a3b8] font-bold"}>{q.answersCount}</span> trả lời</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-8 text-sm text-slate-500 dark:text-[#94a3b8] text-center flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#334155] flex flex-col justify-center items-center">
                                            <Search className="w-6 h-6 text-slate-300 dark:text-[#94a3b8]" />
                                        </div>
                                        <span className="font-medium text-slate-600 dark:text-[#f8fafc]">Không tìm thấy câu hỏi nào phù hợp.</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-6 mr-8">
                    {user ? (
                        <>
                            {/* Notification */}
                            <div className="relative" ref={notifDropdownRef}>
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="relative p-2 text-slate-500 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#1e293b] rounded-full transition-colors"
                                >
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 min-w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white dark:border-[#0f172a] rounded-full">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-[#334155] z-50 flex flex-col">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#334155] sticky top-0 bg-white dark:bg-[#1e293b]">
                                            <span className="font-bold text-slate-800 dark:text-[#f8fafc]">Thông báo</span>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={() => markAllAsRead()}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                                >
                                                    Đánh dấu đã đọc
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex-1 overflow-y-auto">
                                            {isLoading && notifications.length === 0 ? (
                                                <div className="p-4 text-center text-slate-500 dark:text-[#94a3b8] text-sm">Đang tải...</div>
                                            ) : notifications.length > 0 ? (
                                                notifications.map(notif => {
                                                    const isSystem = notif.type === 'approved' || notif.type === 'rejected';
                                                    return (
                                                        <div
                                                            key={notif._id}
                                                            onClick={() => {
                                                                if (!notif.isRead) markAsRead(notif._id);
                                                                setIsNotifOpen(false);
                                                                if (notif.link) navigate(notif.link);
                                                            }}
                                                            className={`flex gap-3 p-3 border-b border-slate-50 dark:border-[#334155]/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden ${
                                                                notif.type === 'approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                                notif.type === 'rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-slate-200 dark:bg-[#334155]'
                                                            }`}>
                                                                {notif.type === 'approved' ? (
                                                                    <ShieldCheck className="w-5 h-5" />
                                                                ) : notif.type === 'rejected' ? (
                                                                    <ShieldAlert className="w-5 h-5" />
                                                                ) : (
                                                                    <img src={notif.senderId?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.senderId?.displayName || notif.senderId?.userName || "U")}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-center">
                                                                <p className="text-sm text-slate-800 dark:text-[#f8fafc] leading-tight">
                                                                    {!isSystem && <span className="font-semibold">{notif.senderId?.displayName || notif.senderId?.userName} </span>}
                                                                    {notif.message}
                                                                </p>
                                                                <span className="text-xs text-slate-500 dark:text-[#94a3b8] mt-1">
                                                                    {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(notif.createdAt))}
                                                                </span>
                                                            </div>
                                                            {!notif.isRead && (
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-6 text-center text-slate-500 dark:text-[#94a3b8] text-sm flex flex-col items-center">
                                                    <Bell className="w-8 h-8 text-slate-300 dark:text-[#94a3b8] mb-2" />
                                                    <p>Bạn chưa có thông báo nào</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-slate-200 dark:bg-[#334155]"></div>

                            {/* Profile */}
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1e293b] p-1.5 rounded-lg transition-colors select-none"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#334155] overflow-hidden border border-slate-100 dark:border-[#334155]">
                                        <img src={user.avatarUrl || userAvatarFallback} alt="User Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-slate-700 dark:text-[#f8fafc] text-sm hidden sm:block">
                                        {userNameDisplay}
                                    </span>
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-[#334155] py-2 z-50">
                                        {/* User Info Header */}
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-[#334155] mb-2">
                                            <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-[#334155] text-white flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                                                <img src={user.avatarUrl || userAvatarFallback} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden leading-tight">
                                                <span className="font-bold text-slate-800 dark:text-[#f8fafc] text-sm truncate">{userNameDisplay}</span>
                                                <span className="text-slate-500 dark:text-[#94a3b8] text-[13px] truncate">{user.email || 'user@dev.com'}</span>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155] hover:text-slate-900 dark:hover:text-[#f8fafc] transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <User className="w-[18px] h-[18px] text-blue-500" />
                                            <span className="font-medium">Hồ sơ cá nhân</span>
                                        </Link>

                                        <Link
                                            to="/settings/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155] hover:text-slate-900 dark:hover:text-[#f8fafc] transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Settings className="w-[18px] h-[18px] text-blue-500" />
                                            <span className="font-medium">Cài đặt</span>
                                        </Link>

                                        <div className="h-px bg-slate-100 dark:bg-[#334155] my-2"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
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
                            <Link to="/signin" className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors">
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
