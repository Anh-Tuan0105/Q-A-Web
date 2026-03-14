import Header from "../../components/header/Header";
import { ChevronRight, Lock, Mail, Info, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../stores/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({
  newEmail: z.string().min(1, "Vui lòng nhập địa chỉ email mới").email("Vui lòng nhập định dạng email hợp lệ"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailChange = () => {
  const { user, requestEmailChange } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    if (data.newEmail === user?.email) {
      toast.error("Email mới không được trùng với email hiện tại");
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestEmailChange(data.newEmail);
      if (res.success) {
        toast.success("Mã xác nhận đã được gửi đến email của bạn");
        navigate('/security/email-auth', { state: { email: data.newEmail } });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi yêu cầu đổi email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-16 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-[13px] font-medium text-slate-400 dark:text-[#94a3b8]">
          <Link to="/settings/profile" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cài đặt</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tài khoản</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 dark:text-blue-400">Thay đổi Email</span>
        </nav>

        <div className="max-w-[800px] mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-[36px] font-bold text-slate-800 dark:text-[#f8fafc] mb-3 tracking-tight" style={{ fontFamily: "Inter, sans-serif" }}>
              Thay đổi địa chỉ Email
            </h1>
            <p className="text-slate-500 dark:text-[#94a3b8] text-[16px]">
              Cập nhật email tài khoản của bạn để nhận thông báo và bảo mật tốt hơn.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-[#334155] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-8 md:p-12 mb-8">
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Current Email Field */}
              <div>
                <label className="block text-[14px] font-bold text-slate-700 dark:text-[#f8fafc] mb-3">Email hiện tại</label>
                <div className="relative group">
                  <input
                    type="email"
                    value={user?.email || "alex.developer@example.com"}
                    readOnly
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-[#334155] border border-slate-100 dark:border-[#334155] rounded-xl text-slate-400 dark:text-[#94a3b8] font-medium cursor-not-allowed text-[15px]"
                  />
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-[#94a3b8]" />
                </div>
              </div>

              {/* New Email Field */}
              <div>
                <label className="block text-[14px] font-bold text-slate-700 dark:text-[#f8fafc] mb-3">Địa chỉ Email mới</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" strokeWidth={2.5} />
                  <input
                    type="email"
                    {...registerEmail("newEmail")}
                    placeholder="Nhập email mới của bạn"
                    className={`w-full pl-14 pr-5 py-4 bg-white dark:bg-[#334155] border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-slate-800 dark:text-[#f8fafc] font-medium text-[15px] placeholder:text-slate-300 dark:placeholder:text-[#94a3b8] ${emailErrors.newEmail
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : "border-blue-100 dark:border-[#334155] focus:border-blue-500 focus:ring-blue-500/10"
                      }`}
                  />
                </div>
                {emailErrors.newEmail ? (
                  <p className="mt-2 text-[13px] text-red-500 font-medium">{emailErrors.newEmail.message}</p>
                ) : (
                  <p className="mt-3 text-[13px] text-slate-400 dark:text-[#94a3b8] font-medium">
                    Chúng tôi sẽ gửi mã xác nhận gồm 6 số đến địa chỉ email mới này.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 flex-1 py-4 bg-[#1877F2] hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(24,119,242,0.3)] transition-all text-[15px]"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Tiếp tục
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/security')}
                  className="flex-1 py-4 bg-slate-50 dark:bg-[#334155] hover:bg-slate-100 dark:hover:bg-[#334155]/80 text-slate-600 dark:text-[#f8fafc] font-bold rounded-xl transition-all text-[15px]"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>

          {/* Important Note Box */}
          <div className="bg-[#EDF5FF] dark:bg-blue-500/10 rounded-2xl p-6 md:p-8 flex gap-5 border border-blue-50 dark:border-blue-500/20">
            <div className="shrink-0">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-[#f8fafc] mb-2 text-[15px]">Lưu ý quan trọng</h3>
              <p className="text-slate-600 dark:text-[#94a3b8] text-[14px] leading-relaxed font-medium">
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
