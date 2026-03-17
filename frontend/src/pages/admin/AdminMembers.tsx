import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Star, ShieldAlert, ShieldCheck, Loader2, Edit2, Check, X, RefreshCw } from 'lucide-react';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const AdminMembers = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReputation, setEditingReputation] = useState<string | null>(null);
  const [tempReputation, setTempReputation] = useState<number>(0);
  const [syncing, setSyncing] = useState(false);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách thành viên:', error);
      toast.error('Không thể tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleBan = async (userId: string) => {
    try {
      await userService.banUser(userId);
      toast.success('Đã cấm người dùng thành công');
      fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cấm người dùng');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await userService.unbanUser(userId);
      toast.success('Đã bỏ cấm người dùng thành công');
      fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi bỏ cấm người dùng');
    }
  };

  const handleUpdateReputation = async (userId: string) => {
    try {
      await userService.updateReputation(userId, tempReputation);
      toast.success('Cập nhật điểm uy tín thành công');
      setEditingReputation(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật điểm uy tín');
    }
  };

  const handleSyncReputation = async () => {
    try {
      setSyncing(true);
      await userService.syncReputation();
      toast.success('Đã đồng bộ toàn bộ điểm uy tín từ vote');
      fetchUsers();
    } catch (error: any) {
      toast.error('Lỗi khi đồng bộ điểm uy tín');
    } finally {
      setSyncing(false);
    }
  };

  const startEditingReputation = (user: User) => {
    setEditingReputation(user._id);
    setTempReputation(user.reputation || 0);
  };

  const filteredMembers = Array.isArray(members) ? members.filter(member => 
    (member.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.userName || "").toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    // 1. Admin lên đầu
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    
    // 2. Sắp xếp theo tên A-Z
    return (a.displayName || "").localeCompare(b.displayName || "", 'vi');
  }) : [];

  // Logic phân trang
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Thành viên</h1>
          <p className="text-gray-500 text-[15px]">
            Tổng quan chi tiết về tất cả những người tham gia cộng đồng, hoạt động của họ và các quyền kiểm soát hành chính.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Tổng Thành Viên</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">{members.length}</div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Đăng Ký Mới (Tháng này)</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {members.filter(m => new Date(m.createdAt).getMonth() === new Date().getMonth()).length}
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-[14px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thành viên theo tên, email hoặc username..."
                className="w-full pl-10 pr-4 py-2 border-none bg-gray-50 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSyncReputation}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                Đồng bộ điểm
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 pb-2">
                  <th className="px-6 py-4 font-bold text-[11px] text-gray-500 uppercase tracking-wider w-2/5">
                    THÀNH VIÊN
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-gray-500 uppercase tracking-wider">
                    VAI TRÒ
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-gray-500 uppercase tracking-wider">
                    UY TÍN
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-gray-500 uppercase tracking-wider">
                    NGÀY THAM GIA
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-gray-500 uppercase tracking-wider text-right">
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedMembers.map((member) => (
                  <tr key={member._id} className={`hover:bg-gray-50/50 transition-colors ${member.isBanned ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.displayName}&background=random`}
                          alt={member.displayName}
                          className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-[14px]">{member.displayName}</span>
                            {member.isBanned && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                <ShieldAlert className="w-3 h-3" />
                                ĐÃ CẤM
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 text-[13px]">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium ${member.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                        {member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingReputation === member._id ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            value={tempReputation}
                            onChange={(e) => setTempReputation(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm font-semibold"
                          />
                          <button onClick={() => handleUpdateReputation(member._id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingReputation(null)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 group">
                          <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            {(member.reputation || 0).toLocaleString()}
                          </div>
                          <button 
                            onClick={() => startEditingReputation(member)}
                            className="p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[13px]">
                      {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true, locale: vi })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== 'admin' && (
                        member.isBanned ? (
                          <button 
                            onClick={() => handleUnban(member._id)}
                            className="px-4 py-1.5 text-[13px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 ml-auto"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Mở ban
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBan(member._id)}
                            className="px-4 py-1.5 text-[13px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1 ml-auto"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            Cấm
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy thành viên nào phù hợp với tìm kiếm của bạn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between font-medium">
            <span className="text-[13px] text-gray-400">
              Đang hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} trên tổng số {totalItems} kết quả
            </span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 border border-gray-200 rounded-md text-[13px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors ${
                        currentPage === page 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors bg-white shadow-sm"
                >
                  Tiếp theo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMembers;
