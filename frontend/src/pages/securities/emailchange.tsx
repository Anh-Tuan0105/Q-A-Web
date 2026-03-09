import Header from "../../components/header/Header";
import { ChevronRight, Lock, Mail, Info } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../stores/useAuthStore";

const EmailChange = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-16 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-[13px] font-medium text-slate-400">
          <Link to="/settings/profile" className="hover:text-blue-600 transition-colors">Cài đặt</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/security" className="hover:text-blue-600 transition-colors">Tài khoản</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600">Thay đổi Email</span>
        </nav>

        <div className="max-w-[800px] mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-[36px] font-bold text-slate-800 mb-3 tracking-tight" style={{ fontFamily: "Inter, sans-serif" }}>
              Thay đổi địa chỉ Email
            </h1>
            <p className="text-slate-500 text-[16px]">
              Cập nhật email tài khoản của bạn để nhận thông báo và bảo mật tốt hơn.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-8">
            <div className="space-y-8">
              {/* Current Email Field */}
              <div>
                <label className="block text-[14px] font-bold text-slate-700 mb-3">Email hiện tại</label>
                <div className="relative group">
                  <input
                    type="email"
                    value={user?.email || "alex.developer@example.com"}
                    readOnly
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-medium cursor-not-allowed text-[15px]"
                  />
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>
              </div>

              {/* New Email Field */}
              <div>
                <label className="block text-[14px] font-bold text-slate-700 mb-3">Địa chỉ Email mới</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" strokeWidth={2.5} />
                  <input
                    type="email"
                    placeholder="Nhập email mới của bạn"
                    className="w-full pl-14 pr-5 py-4 bg-white border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium text-[15px] placeholder:text-slate-300"
                  />
                </div>
                <p className="mt-3 text-[13px] text-slate-400 font-medium">
                  Chúng tôi sẽ gửi mã xác nhận đến địa chỉ email mới này.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => navigate('/security/email-auth')}
                  className="flex-1 py-4 bg-[#1877F2] hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(24,119,242,0.3)] transition-all text-[15px]"
                >
                  Xác nhận thay đổi
                </button>
                <button 
                  onClick={() => navigate('/security')}
                  className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all text-[15px]"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>

          {/* Important Note Box */}
          <div className="bg-[#EDF5FF] rounded-2xl p-6 md:p-8 flex gap-5 border border-blue-50">
            <div className="shrink-0">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2 text-[15px]">Lưu ý quan trọng</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed font-medium">
                Sau khi thay đổi, bạn sẽ cần đăng nhập lại bằng email mới. Mọi dữ liệu và quyền hạn của bạn sẽ được giữ nguyên.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailChange;
