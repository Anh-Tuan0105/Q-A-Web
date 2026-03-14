import { Search, SlidersHorizontal, Star } from 'lucide-react';

const AdminMembers = () => {
  const members = [
    {
      id: 1,
      name: 'Jordan Smith',
      email: 'jordan.smith@example.com',
      role: 'Thành viên',
      reputation: 1820,
      lastActive: '2 phút trước',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      avatarBg: 'bg-blue-100',
      avatarText: 'text-blue-600',
      initials: 'JD'
    },
    {
      id: 2,
      name: 'Taylor Wong',
      email: 't.wong@community.org',
      role: 'Thành viên',
      reputation: 950,
      lastActive: '1 giờ trước',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026224d',
    },
    {
      id: 3,
      name: 'Morgan Lee',
      email: 'morgan.l@web.com',
      role: 'Thành viên',
      reputation: 420,
      lastActive: 'Hôm qua',
      avatarBg: 'bg-gray-100',
      avatarText: 'text-gray-600',
      initials: 'ML'
    },
    {
      id: 4,
      name: 'Riley Parker',
      email: 'riley.p@studio.io',
      role: 'Thành viên',
      reputation: 3140,
      lastActive: '4 giờ trước',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026424d',
    }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Thành viên</h1>
          <p className="text-gray-500 text-[15px]">
            Tổng quan chi tiết về tất cả những người tham gia cộng đồng, hoạt động của họ và các quyền kiểm soát hành chính.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Members Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Tổng Thành Viên</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">1,284</div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
            </div>
          </div>

          {/* New Registrations Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Đăng Ký Mới</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">12</div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-1/4 rounded-full"></div>
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
                placeholder="Tìm kiếm thành viên theo tên, email hoặc ID..."
                className="w-full pl-10 pr-4 py-2 border-none bg-gray-50 rounded-lg text-sm focus:ring-0 focus:outline-none transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc
            </button>
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
                    HOẠT ĐỘNG CUỐI
                  </th>
                  <th className="px-6 py-4 font-bold text-[11px] text-gray-500 uppercase tracking-wider text-right">
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${member.avatarBg} ${member.avatarText}`}>
                            {member.initials}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-[14px]">{member.name}</div>
                          <div className="text-gray-500 text-[13px]">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-gray-100 text-gray-600">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {member.reputation.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[13px]">
                      {member.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-1.5 text-[13px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
                        Cấm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[13px] text-gray-500 font-medium">
              Đang hiển thị 1 đến 4 trên tổng số 1,284 kết quả
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 border border-gray-200 rounded-md text-[13px] font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>
                Trước
              </button>
              <button className="px-4 py-1.5 border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm bg-white">
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMembers;
