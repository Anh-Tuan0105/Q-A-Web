import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Settings, Users, LogOut, FileText, Tag } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

const AdminSidebar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Bài viết', href: '/admin/posts', icon: FileText },
        { name: 'Tags', href: '/admin/tags', icon: Tag },
        { name: 'Thành viên', href: '/admin/members', icon: Users },
        { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-screen fixed left-0 top-0 z-20">
            <div>
                {/* Logo Area */}
                <div className="p-6 flex items-center space-x-3 mb-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-yellow-400 to-orange-400 text-white font-bold text-lg shadow-sm">
                            <img src="/logo.svg" alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[#1A202C] font-semibold text-[15px] leading-tight flex items-center gap-1">
                            Quản trị Hệ thống
                        </h1>
                        <span className="text-gray-500 text-xs font-medium">Dev Community</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-3 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                end={item.href === '/admin'}
                                className={({ isActive }) => `
                                    group flex items-center px-3 py-2.5 text-[14px] font-medium rounded-lg mb-1 transition-all
                                    ${isActive
                                        ? 'bg-[#F0F5FF] text-[#2563EB] shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={`
                                                mr-3 flex-shrink-0 h-5 w-5
                                                ${isActive ? 'text-[#3B82F6]' : 'text-gray-400 group-hover:text-gray-500'}
                                            `}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        {item.name}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-[#E2E8F0] m-4 rounded-xl bg-gray-50/50">
                <div className="flex items-center w-full">
                    <div className="flex-shrink-0 mr-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium overflow-hidden">
                            <img
                                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=random`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 truncate">
                            {user?.userName || 'Admin User'}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                            {user?.email || 'admin@community.io'}
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
