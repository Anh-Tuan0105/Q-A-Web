import React from 'react';
import { NavLink } from 'react-router';
import { FileText, Users, Settings, LogOut } from 'lucide-react';

const AdminSidebar: React.FC = () => {
    const menuItems = [
        { name: 'Bài viết', icon: <FileText size={20} />, path: '/admin/posts', canNavigate: true },
        { name: 'Thành viên', icon: <Users size={20} />, path: '/admin/members', canNavigate: false },
        { name: 'Cài đặt', icon: <Settings size={20} />, path: '/admin/settings', canNavigate: false },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    AD
                </div>
                <div>
                    <h1 className="font-bold text-gray-900 text-sm">Quản trị Hệ thống</h1>
                    <p className="text-xs text-gray-500">Dev Community</p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-6">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            {item.canNavigate ? (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </NavLink>
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition-all">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-2">
                    <img
                        src="https://ui-avatars.com/api/?name=Alex+Johnson&background=random"
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-orange-200"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">Alex Johnson</p>
                        <p className="text-xs text-gray-500 truncate">Quản trị viên cấp cao</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
