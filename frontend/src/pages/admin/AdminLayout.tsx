import { Link, Outlet, useLocation } from 'react-router';
import { Settings, FileText, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Bài viết', href: '/admin/posts', icon: FileText },
    { name: 'Thành viên', href: '/admin/members', icon: Users },
    { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="p-6 flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-yellow-400 to-orange-400 text-white font-bold text-lg shadow-sm">
                A
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
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-[14px] font-medium rounded-lg mb-1
                    ${isActive
                      ? 'bg-[#F0F5FF] text-[#2563EB] shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5
                      ${isActive ? 'text-[#3B82F6]' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[#E2E8F0] m-4 rounded-xl">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0 mr-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="avatar" className="w-full h-full rounded-full opacity-80" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-gray-900 truncate">
                Alex Johnson
              </p>
              <p className="text-[12px] text-gray-500 truncate">
                alex@community.io
              </p>
            </div>
            <div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="px-8 py-10 max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
