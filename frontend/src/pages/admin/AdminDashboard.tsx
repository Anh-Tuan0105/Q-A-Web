import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, Bell, FileText, Flag, MessageSquare, Filter, ChevronLeft, ChevronRight, Edit3, Trash2, CheckCircle, XCircle, RefreshCw, Shield, ShieldAlert } from 'lucide-react';
import { questionService } from '../../services/questionService';
import { reportService, type Report } from '../../services/reportService';
import { useSocketStore } from '../../stores/useSocketStore';
import { toast } from 'sonner';

// Xử lý logic hiển thị



const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'reported'>('all');
    
    // States cho Questions
    const [questions, setQuestions] = useState<any[]>([]);
    const [qTotal, setQTotal] = useState(0);
    const [qPage, setQPage] = useState(1);
    const [qTotalPages, setQTotalPages] = useState(1);
    const [qStatusFilter, setQStatusFilter] = useState<'all' | 'open' | 'pending'>('all');
    
    // States cho Reports
    const [reports, setReports] = useState<Report[]>([]);
    const [rTotal, setRTotal] = useState(0);
    const [rPage, setRPage] = useState(1);
    const [rTotalPages, setRTotalPages] = useState(1);
    const [rTypeFilter, setRTypeFilter] = useState<'all' | 'Question' | 'Answer'>('all');

    // Search & Notification
    const [searchKeyword, setSearchKeyword] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [unreadReports, setUnreadReports] = useState(0);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const socket = useSocketStore(state => state.socket);

    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchKeyword);
            setQPage(1); // Reset page on search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchKeyword]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'all') {
                const data = await questionService.getQuestions(qPage, 'newest', '', debouncedSearch, qStatusFilter);
                setQuestions(data.questions);
                setQTotal(data.totalQuestions || 0);
                setQTotalPages(data.totalPages || 1);
            } else if (activeTab === 'reported') {
                const data = await reportService.getReports('Pending', rTypeFilter === 'all' ? '' : rTypeFilter, debouncedSearch, rPage);
                setReports(data.reports);
                setRTotal(data.total);
                setRTotalPages(data.totalPages || 1);
            }
        } catch (err) {
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, qPage, rPage, debouncedSearch, qStatusFilter, rTypeFilter]);

    // WebSocket logic
    useEffect(() => {
        if (!socket) {
            useSocketStore.getState().connect();
            return;
        }

        const handleNewReport = () => {
            setUnreadReports(prev => prev + 1);
            if (activeTab === 'reported') {
                fetchData(); // reload
            } else {
                setRTotal(prev => prev + 1);
            }
            toast('Có báo cáo vi phạm mới!');
        };

        const handleReportProcessed = () => {
             if (activeTab === 'reported') {
                 fetchData();
             }
        };

        socket.on('new_report', handleNewReport);
        socket.on('report_processed', handleReportProcessed);

        return () => {
            socket.off('new_report', handleNewReport);
            socket.off('report_processed', handleReportProcessed);
        };
    }, [socket, activeTab, qPage, debouncedSearch, qStatusFilter, rTypeFilter]); // Add dependencies to ensure fetchData inside handlers uses latest states

    const handleApprove = async (id: string) => {
        setActionLoadingId(id);
        try {
            await reportService.approveReport(id);
            toast.success('Đã duyệt qua bài viết');
            fetchData();
        } catch {
            toast.error('Thao tác thất bại');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoadingId(id);
        try {
            await reportService.rejectReport(id);
            toast.success('Đã xác nhận vi phạm và gỡ bỏ');
            fetchData();
        } catch {
            toast.error('Thao tác thất bại');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteReport = async (id: string) => {
        if (!confirm('Xóa báo cáo này?')) return;
        try {
            await reportService.deleteReport(id);
            toast.success('Đã xóa báo cáo');
            fetchData();
        } catch {
            toast.error('Thất bại');
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Xóa bài viết này? Hành động này không thể hoàn tác.')) return;
        try {
            await questionService.deleteQuestion(id);
            toast.success('Đã xóa bài viết');
            fetchData();
            setQTotal(prev => Math.max(0, prev - 1));
        } catch {
            toast.error('Thất bại khi xóa bài viết');
        }
    };

    const stats = [
        { title: 'Câu hỏi hệ thống', value: qTotal.toLocaleString(), icon: <FileText className="text-blue-500" />, bgColor: 'bg-blue-50' },
        { title: 'Chờ kiểm duyệt', value: rTotal.toLocaleString(), icon: <Flag className="text-red-500" />, bgColor: 'bg-red-50' },
        { title: 'Tương tác', value: '243', icon: <MessageSquare className="text-green-500" />, bgColor: 'bg-green-50' },
    ];


    return (
        <div className="space-y-8">
            {/* Top Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm kiếm bài viết..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <div className="relative">
                    <button 
                        onClick={() => { setIsNotifOpen(!isNotifOpen); }}
                        className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                    >
                        <Bell className="w-6 h-6" />
                        {unreadReports > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white rounded-full">
                                {unreadReports > 9 ? '9+' : unreadReports}
                            </span>
                        )}
                    </button>
                    
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 z-50 flex flex-col">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white">
                                <span className="font-bold text-slate-800">Thông báo {unreadReports > 0 ? `(${unreadReports})` : ''}</span>
                                {unreadReports > 0 && (
                                    <button
                                        onClick={() => setUnreadReports(0)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {reports.length > 0 ? (
                                    reports.slice(0, 5).map((report, index) => {
                                        const isUnread = index < unreadReports;
                                        return (
                                            <div
                                                key={report._id}
                                                onClick={() => {
                                                    setActiveTab('reported');
                                                    setIsNotifOpen(false);
                                                    setUnreadReports(0);
                                                    setRPage(1);
                                                }}
                                                className={`flex gap-3 p-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${isUnread ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden bg-red-100 text-red-600">
                                                    <ShieldAlert className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <p className="text-sm text-slate-800 leading-tight">
                                                        Báo cáo {report.contentType.toLowerCase()} mới: <span className="font-semibold">{report.content.title?.slice(0, 30) || 'Nội dung...'}</span>
                                                    </p>
                                                    <span className="text-xs text-slate-500 mt-1">
                                                        {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(report.createdAt))}
                                                    </span>
                                                </div>
                                                {isUnread && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-slate-500 text-sm flex flex-col items-center">
                                        <Bell className="w-8 h-8 text-slate-300 mb-2" />
                                        <p>Bạn chưa có thông báo nào</p>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => { setActiveTab('reported'); setRPage(1); setIsNotifOpen(false); }}
                                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-blue-600 text-sm font-bold transition-colors cursor-pointer border-t border-slate-100"
                            >
                                Xem tất cả báo cáo
                            </button>
                        </div>
                    )}
                </div>
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
                        {['Tất cả', 'Bị báo cáo'].map((tab, idx) => {
                            const tabId = tab === 'Tất cả' ? 'all' : 'reported';
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setActiveTab(tabId);
                                        setQPage(1);
                                        setRPage(1);
                                    }}
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
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        {activeTab === 'all' ? (
                            <select 
                                value={qStatusFilter}
                                onChange={(e) => { setQStatusFilter(e.target.value as any); setQPage(1); }}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 outline-none cursor-pointer leading-[normal]"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="open">Đã đăng</option>
                                <option value="pending">Đang chờ</option>
                            </select>
                        ) : (
                            <select 
                                value={rTypeFilter}
                                onChange={(e) => { setRTypeFilter(e.target.value as any); setRPage(1); }}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 outline-none cursor-pointer leading-[normal]"
                            >
                                <option value="all">Tất cả</option>
                                <option value="Question">Câu hỏi</option>
                                <option value="Answer">Câu trả lời</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <RefreshCw size={32} className="animate-spin mb-4" />
                            <p className="text-sm">Đang tải dữ liệu...</p>
                        </div>
                    ) : activeTab === 'reported' ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">Nội dung báo cáo</th>
                                    <th className="px-6 py-4">Loại</th>
                                    <th className="px-6 py-4">Tác giả</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-gray-400">
                                            <Shield size={40} className="mx-auto mb-2 opacity-20" />
                                            Không có nội dung nào bị báo cáo
                                        </td>
                                    </tr>
                                ) : reports.map((report) => (
                                    <tr key={report._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5 max-w-md">
                                            <p className="font-bold text-gray-900 text-sm line-clamp-1 italic">
                                                "{report.content.title || report.content.body?.slice(0, 60)}"
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">Lý do: {report.reason}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                                report.contentType === 'Question' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                                {report.contentType.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-gray-600">{report.userId?.displayName || 'Ẩn danh'}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-bold border border-yellow-200 uppercase">
                                                Chờ xử lý
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleApprove(report._id)}
                                                    disabled={actionLoadingId === report._id}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(report._id)}
                                                    disabled={actionLoadingId === report._id}
                                                    title="Xác nhận vi phạm"
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteReport(report._id)}
                                                    disabled={actionLoadingId === report._id}
                                                    title="Xóa báo cáo"
                                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
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
                                {questions.map((post) => (
                                    <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5 max-w-md">
                                            <Link to={`/admin/posts/${post._id}`} className="block hover:text-blue-600 transition-colors">
                                                <p className="font-bold text-gray-900 line-clamp-1">{post.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">{post.content.replace(/<[^>]*>/g, '').slice(0, 100)}...</p>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={post.userId?.avatarUrl || `https://ui-avatars.com/api/?name=${post.userId?.displayName || 'U'}&background=random`}
                                                    alt={post.userId?.displayName}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{post.userId?.displayName || 'User'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                post.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                                            }`}>
                                                {post.status === 'pending' ? 'ĐANG CHỜ' : 'ĐÃ ĐĂNG'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => window.open(`/questions/${post._id}`, '_blank')} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer" title="Xem & Sửa bài viết (tab thả nổi)">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteQuestion(post._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>


                <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                    <p>Hiển thị tab {activeTab === 'reported' ? 'Báo cáo' : 'Bài viết'}</p>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => activeTab === 'all' ? setQPage(p => Math.max(1, p-1)) : setRPage(p => Math.max(1, p-1))}
                            disabled={activeTab === 'all' ? qPage === 1 : rPage === 1}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-4 font-bold text-blue-600">Trang {activeTab === 'all' ? qPage : rPage} / {Math.max(1, activeTab === 'all' ? qTotalPages : rTotalPages)}</span>
                        <button 
                            onClick={() => activeTab === 'all' ? setQPage(p => Math.min(qTotalPages, p+1)) : setRPage(p => Math.min(rTotalPages, p+1))}
                            disabled={activeTab === 'all' ? qPage >= qTotalPages : rPage >= rTotalPages}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
