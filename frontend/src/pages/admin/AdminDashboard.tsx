import React, { useState } from 'react';
import { Link } from 'react-router';
import { Search, Bell, FileText, Flag, MessageSquare, Filter, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    const stats = [
        { title: 'Tổng số bài viết', value: '1,284', icon: <FileText className="text-blue-500" />, bgColor: 'bg-blue-50' },
        { title: 'Bị báo cáo', value: '12', icon: <Flag className="text-red-500" />, bgColor: 'bg-red-50' },
        { title: 'Bình luận mới', value: '243', icon: <MessageSquare className="text-green-500" />, bgColor: 'bg-green-50' },
    ];

    const posts = [
        {
            id: 1,
            title: 'Làm thế nào để nâng cấp lên gói Enterprise?',
            description: 'Tôi đang tìm trạng giá cho các gói cấp cao hơn...',
            author: 'User123',
            date: '24 thg 10, 2023',
            status: 'Đã đăng',
            statusColor: 'bg-green-50 text-green-700',
        },
        {
            id: 2,
            title: 'Sự cố kết nối API ở Bắc Âu',
            description: 'Chúng tôi thấy lỗi 503 trên tất cả các điểm cuối từ...',
            author: 'DevGuru',
            date: '23 thg 10, 2023',
            status: 'Đã đăng',
            statusColor: 'bg-green-50 text-green-700',
        },
        {
            id: 3,
            title: 'Yêu cầu tính năng: Chế độ tối hệ thống',
            description: 'Giao diện hiện tại rất tốt, nhưng nếu có chế độ tối tích...',
            author: 'DesignLover',
            date: '22 thg 10, 2023',
            status: 'Đã đăng',
            statusColor: 'bg-green-50 text-green-700',
        },
        {
            id: 4,
            title: 'Spam: Nhận token miễn phí tại đây!',
            description: 'Click vào link này để nhận tiền điện tử hoàn toàn miễn...',
            author: 'Bot404',
            date: '21 thg 10, 2023',
            status: 'Bị báo cáo',
            statusColor: 'bg-red-50 text-red-700',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Top Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết, tác giả hoặc thẻ..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-500 relative cursor-pointer">
                    <Bell size={22} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>

            {/* Page Title & Summary */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Bài viết Cộng đồng</h2>
                    <p className="text-gray-500">Quản lý tất cả nội dung do người dùng tạo, điều phối thảo luận và xem xét các mục bị báo cáo.</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center p-3`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub-Navigation & Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex gap-8">
                        {['Tất cả', 'Bị báo cáo', 'Đã lưu trữ'].map((tab, idx) => {
                            const tabId = tab === 'Tất cả' ? 'all' : tab === 'Bị báo cáo' ? 'reported' : 'archived';
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(tabId)}
                                    className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tabId ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tabId && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer">
                        <Filter size={16} />
                        Lọc
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Tiêu đề bài viết</th>
                                <th className="px-6 py-4">Tác giả</th>
                                <th className="px-6 py-4">Ngày đăng</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5 max-w-md">
                                        <Link to={`/admin/posts/${post.id}`} className="block hover:text-blue-600 transition-colors">
                                            <p className="font-bold text-gray-900 line-clamp-1">{post.title}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">{post.description}</p>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                                                alt={post.author}
                                                className="w-7 h-7 rounded-full"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{post.author}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">{post.date}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${post.statusColor}`}>
                                            {post.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
                                                <Edit3 size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                    <p>Hiển thị 1 đến 4 trong tổng số 1,284 bài viết</p>
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 bg-blue-600 text-white font-bold rounded-lg shadow-sm">1</button>
                        <button className="w-8 h-8 hover:bg-gray-100 font-medium rounded-lg">2</button>
                        <button className="w-8 h-8 hover:bg-gray-100 font-medium rounded-lg">3</button>
                        <span className="px-2">...</span>
                        <button className="w-8 h-8 hover:bg-gray-100 font-medium rounded-lg">321</button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
