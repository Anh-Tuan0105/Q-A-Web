import Header from "../../components/header/Header";
import { User, Lock, MapPin, Link as LinkIcon, Camera, X, Github, Linkedin } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router";

const SettingProfile = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-[100vh] bg-white flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-col md:flex-row flex-1 w-full max-w-[1400px] mx-auto">
        {/* Left Sidebar Profile Section - Takes full height and has a right border */}
        <aside className="w-full md:w-[280px] shrink-0 border-r border-blue-100/50 bg-[#FAFBFF]/30 min-h-[calc(100vh-64px)] py-8 px-6">
          <div className="flex flex-col">
            {/* User Profile Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${user?.displayName || user?.userName || "U"}&background=random`} alt="User Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-[14px] leading-snug">{user?.displayName || "Nguyen Van A"}</span>
                <span className="text-slate-500 text-[12px]">Full Stack Developer</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[14px] transition-colors ${location.pathname === '/settings/profile' ? 'bg-[#F0F5FF] text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
                Hồ Sơ Cá Nhân
              </div>
              <div
                onClick={() => navigate('/security')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[14px] transition-colors ${location.pathname === '/security' ? 'bg-[#F0F5FF] text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <Lock className="w-[18px] h-[18px] text-slate-700" strokeWidth={2.5} />
                Bảo mật & Đăng nhập
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-8 md:px-12 lg:px-16 py-8 md:py-10 max-w-[900px]">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-slate-800 mb-1 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Hồ Sơ Cá Nhân</h1>
            <p className="text-slate-400 text-[14px] mt-1 font-medium">Quản lý thông tin hồ sơ hiển thị công khai của bạn.</p>
          </div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-[16px] font-bold text-slate-800 mb-6 font-sans">Ảnh đại diện</h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 pb-2 border-b border-slate-100">
                  <div className="relative shrink-0">
                    <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-slate-100 border-[3px] border-white shadow-sm ring-1 ring-slate-100">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${user?.displayName || user?.userName || "U"}&background=random`} alt="User Avatar" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-1 w-7 h-7 bg-[#1877F2] text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-600 transition-colors shadow-sm">
                      <Camera className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 mb-2.5">
                      <button className="px-5 py-[9px] bg-[#1877F2] hover:bg-blue-600 text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">
                        Tải ảnh mới
                      </button>
                      <button className="px-5 py-[9px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-bold rounded-lg transition-colors">
                        Xóa ảnh
                      </button>
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium">
                      Hỗ trợ định dạng JPG, GIF hoặc PNG. Kích thước tối đa 800KB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-[16px] font-bold text-slate-800 mb-6 font-sans">Thông tin cơ bản</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Họ và tên</label>
                    <input
                      type="text"
                      defaultValue={user?.displayName || "Nguyen Van A"}
                      className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-[14px] text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Chức danh</label>
                    <input
                      type="text"
                      defaultValue="Full Stack Developer"
                      className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-[14px] text-slate-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[13px] text-slate-400 font-medium mb-2">Giới thiệu ngắn (Bio)</label>
                  <div className="relative">
                    <textarea
                      placeholder="Chia sẻ một chút về bản thân, kinh nghiệm và sở thích lập trình..."
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px] resize-none font-medium placeholder:text-slate-300"
                    ></textarea>
                    <div className="absolute bottom-[-24px] right-2 text-[11px] font-semibold text-slate-400">
                      0/200 ký tự
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Địa điểm</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" strokeWidth={2} />
                      <input
                        type="text"
                        defaultValue="Ho Chi Minh City, Vietnam"
                        className="w-full pl-10 pr-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-[14px] text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Website cá nhân</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" strokeWidth={2} />
                      <input
                        type="text"
                        defaultValue="https://nguyenvana.dev"
                        className="w-full pl-10 pr-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-[14px] text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-[16px] font-bold text-slate-800 mb-6 font-sans">Liên kết xã hội</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-[34px]">
                      <Github className="w-6 h-6 text-[#24292e]" />
                    </div>
                    <div className="flex-1 w-full max-w-[800px]">
                      <label className="block text-[13px] text-slate-400 font-medium mb-2">GitHub Username</label>
                      <div className="relative">
                        <input
                          type="text"
                          defaultValue="nguyenvanadev"
                          className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-[14px] text-slate-500"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-[34px]">
                      <Linkedin className="w-6 h-6 text-[#0A66C2]" fill="currentColor" />
                    </div>
                    <div className="flex-1 w-full max-w-[800px]">
                      <label className="block text-[13px] text-slate-400 font-medium mb-2">LinkedIn URL</label>
                      <input
                        type="text"
                        placeholder="Thêm liên kết LinkedIn"
                        className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-[14px] placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-6 flex justify-end gap-3 items-center mt-6">
              <button className="px-6 py-[10px] bg-white text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-[14px]">
                Hủy bỏ
              </button>
              <button className="px-6 py-[10px] bg-[#1877F2] hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-sm text-[14px]">
                Lưu thay đổi
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingProfile;
