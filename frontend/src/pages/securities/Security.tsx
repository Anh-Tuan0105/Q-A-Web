import Header from "../../components/header/Header";
import { Mail, CheckCircle, User, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "../../services/authService";

const Security = () => {
  const { user, requestEmailChange } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCurrentEmailAuth = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const res = await requestEmailChange(user.email);
      if (res.success) {
        toast.success("Mã xác nhận đã được gửi đến email hiện tại của bạn");
        navigate('/security/email-auth', { state: { email: user.email } });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lạc mất yêu cầu, vui lòng thử lại");
    } finally {
      setIsResending(false);
    }
  };

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
                onClick={() => navigate('/settings/profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[14px] transition-colors ${location.pathname === '/settings/profile' ? 'bg-[#F0F5FF] text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
                Hồ Sơ Cá Nhân
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-[14px] transition-colors bg-[#F0F5FF] text-blue-600"
              >
                <Lock className="w-[18px] h-[18px] text-blue-600" strokeWidth={2.5} />
                Bảo mật & Đăng nhập
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-8 md:px-12 lg:px-16 py-8 md:py-10 max-w-[900px]">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-slate-800 mb-1 tracking-tight">Bảo mật & Đăng nhập</h1>
            <p className="text-slate-400 text-[14px] mt-1 font-medium">Quản lý các thiết lập bảo mật và bảo vệ tài khoản của bạn.</p>
          </div>

          <div className="space-y-6">
            {/* Change Password Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <span className="text-[#1877F2] font-black text-xl tracking-widest mt-1">***</span>
                  <h2 className="text-[16px] font-bold text-slate-800 font-sans">Thay đổi mật khẩu</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-200 text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-200 text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-400 font-medium mb-2">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-[11px] bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-200 text-[14px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-6 mt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1877F2] hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-lg transition-colors shadow-sm text-[14px]"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>
            </div>

            {/* Email Verification Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden mt-6">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
                  <Mail className="w-[18px] h-[18px] text-[#1877F2]" strokeWidth={2.5} />
                  <h2 className="text-[16px] font-bold text-slate-800 font-sans">Xác thực Email</h2>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-[22px] h-[22px]" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-slate-400 mb-1">Địa chỉ email hiện tại</div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-bold text-slate-800 text-[15px] tracking-tight truncate max-w-full">
                          {user?.email || "lequangdung2906@gmail.com"}
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 rounded-full text-green-600 text-[11px] font-bold whitespace-nowrap">
                          <CheckCircle className="w-3 h-3" />
                          Đã xác thực
                        </div>
                      </div>
                      <p className="text-[13px] text-slate-400 leading-relaxed max-w-[480px]">
                        Email của bạn được sử dụng để nhận thông báo quan trọng và khôi phục mật khẩu.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => navigate('/security/email-change')}
                      className="flex-1 lg:flex-none px-5 py-[9px] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold transition-colors text-[13px] whitespace-nowrap shadow-sm"
                    >
                      Thay đổi email
                    </button>
                    <button
                      onClick={handleResendCurrentEmailAuth}
                      disabled={isResending}
                      className="flex items-center gap-2 px-5 py-[9px] bg-[#1C1E21] hover:bg-black disabled:bg-slate-400 text-white rounded-lg font-bold transition-colors text-[13px] shadow-sm whitespace-nowrap"
                    >
                      {isResending && <Loader2 className="w-4 h-4 animate-spin" />}
                      Gửi lại mã xác thực
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Security;
