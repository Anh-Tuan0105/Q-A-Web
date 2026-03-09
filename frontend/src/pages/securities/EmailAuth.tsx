import { Mail, ArrowRight, HelpCircle, Loader2, Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const otpSchema = z.object({
  otp: z.string().length(6, "Vui lòng nhập mã xác nhận 6 số").regex(/^\d+$/, "Mã xác nhận chỉ bao gồm số"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const EmailAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmailChange, requestEmailChange, logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const submittedEmail = location.state?.email || "";

  useEffect(() => {
    if (!submittedEmail) {
      toast.error("Vui lòng nhập email trước khi xác thực");
      navigate("/security/email-change");
    }
  }, [submittedEmail, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    try {
      const res = await requestEmailChange(submittedEmail);
      if (res.success) {
        toast.success("Mã xác nhận mới đã được gửi");
        setCountdown(60);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi lại mã");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      const res = await verifyEmailChange(submittedEmail, data.otp);
      if (res.success) {
        toast.success("Thay đổi email thành công! Vui lòng đăng nhập lại.");
        await logout();
        navigate("/signin");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Mã xác nhận không hợp lệ hoặc đã hết hạn");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Icon Header */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Mail className="w-8 h-8" strokeWidth={2} />
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-10">
            <h1 className="text-[24px] font-bold text-slate-800 mb-3 tracking-tight">
              Xác thực Email của bạn
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed px-4">
              Chúng tôi đã gửi mã OTP 6 chữ số đến email <span className="font-bold text-slate-700">{submittedEmail}</span>
            </p>
          </div>

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit(onOtpSubmit)}>
            <div className="mb-8">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" strokeWidth={2.5} />
                <input
                  type="text"
                  maxLength={6}
                  {...register("otp", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                    }
                  })}
                  placeholder="Nhập 6 số"
                  className={`w-full pl-14 pr-5 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-slate-800 font-bold text-[18px] tracking-[0.5em] md:tracking-widest placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-medium text-center sm:text-left ${errors.otp
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-blue-100 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                />
              </div>
              {errors.otp && (
                <p className="mt-2 text-[13px] text-red-500 font-medium text-center">{errors.otp.message}</p>
              )}
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1877F2] hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(24,119,242,0.25)] transition-all flex items-center justify-center gap-2 group mb-6"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận mã"}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Resend Timer */}
          <div className="text-center">
            <p className="text-[14px] font-medium text-slate-400">
              Không nhận được mã?{" "}
              {countdown > 0 ? (
                <span className="text-slate-500 font-bold">Gửi lại sau {countdown}s</span>
              ) : (
                <span onClick={handleResendOtp} className="text-blue-500 font-bold cursor-pointer hover:underline underline-offset-4">
                  Gửi lại mã
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-slate-50/50 p-6 border-t border-slate-50 flex items-center justify-center gap-2 text-[13px] font-medium text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Cần hỗ trợ? <button className="text-slate-700 hover:text-blue-600 transition-colors">Liên hệ quản trị viên</button></span>
        </div>
      </div>
    </div>
  );
};

export default EmailAuth;
