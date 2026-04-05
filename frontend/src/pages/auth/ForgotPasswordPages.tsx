import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthFooter from '../../components/auth/AuthFooter';

// Validation Schemas for 3 steps
const emailSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải bao gồm đúng 6 ký tự"),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const ForgotPasswordPages = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Step 4 is success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const navigate = useNavigate();

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onEmailSubmit = async (data: EmailForm) => {
    try {
      const res = await authService.forgotPassword(data.email);
      if (res.success) {
        setEmail(data.email);
        toast.success(res.message);
        setStep(2);
        setCountdown(60);
      }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu");
    }
  };

  const onOtpSubmit = async (data: OtpForm) => {
    try {
      const res = await authService.verifyForgotOTP(email, data.otp);
      if (res.success) {
        setOtp(data.otp);
        toast.success(res.message);
        setStep(3);
      }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Mã OTP không hợp lệ");
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      const res = await authService.resetPassword(email, otp, data.newPassword);
      if (res.success) {
        toast.success(res.message);
        setStep(4);
      }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader type="signin" />

      <div className="flex-1 bg-linear-to-b from-blue-100 to-white flex items-center justify-center py-12 px-4 shadow-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-120 animate-in fade-in zoom-in-95 duration-300">
            
          {/* Back to Login Button */}
          {step < 4 && (
            <button 
              onClick={() => step === 1 ? navigate('/signin') : setStep(prev => (prev - 1) as any)}
              className="flex items-center text-[#64748B] hover:text-[#137FEC] text-[14px] font-medium transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-1" />
              {step === 1 ? "Quay lại đăng nhập" : "Quay lại bước trước"}
            </button>
          )}

          <div className="text-center mb-8">
            <h1 className="font-extrabold text-[32px] text-[#0F172A] mb-2 leading-tight">
                {step === 1 && "Quên mật khẩu?"}
                {step === 2 && "Nhập mã xác nhận"}
                {step === 3 && "Tạo mật khẩu mới"}
                {step === 4 && "Thành công!"}
            </h1>
            <p className="font-medium text-[15px] text-[#64748B] max-w-75 mx-auto">
                {step === 1 && "Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu."}
                {step === 2 && `Mã xác nhận gồm 6 chữ số đã được gửi đến email ${email}.`}
                {step === 3 && "Vui lòng nhập mật khẩu mới bảo mật cho tài khoản của bạn."}
                {step === 4 && "Mật khẩu của bạn đã được thay đổi. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới."}
            </p>
          </div>

          {/* STEP 1: Email Form */}
          {step === 1 && (
            <form className="space-y-6 animate-in slide-in-from-right-10 duration-300" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <div className="space-y-2">
                <label className="font-bold text-[14px] text-[#334155] block">Địa chỉ Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-[#137FEC] focus:bg-white transition-all text-[#1e293b] placeholder:text-slate-400"
                    {...emailForm.register("email")}
                  />
                </div>
                {emailForm.formState.errors.email && <p className="text-red-500 text-[12px]">{emailForm.formState.errors.email.message}</p>}
              </div>

              <button
                type='submit'
                disabled={emailForm.formState.isSubmitting}
                className="cursor-pointer flex items-center justify-center w-full bg-[#137FEC] hover:bg-[#116ecf] active:scale-[0.99] py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-100/50 mt-2">
                {emailForm.formState.isSubmitting ? "Đang gửi..." : "Gửi mã xác nhận"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Form */}
          {step === 2 && (
            <form className="space-y-6 animate-in slide-in-from-right-10 duration-300" onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
              <div className="space-y-2">
                <label className="font-bold text-[14px] text-[#334155] block">Mã OTP (6 số)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Nhập 6 ký tự mã OTP"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] tracking-widest font-mono text-center text-lg py-3.5 pl-4 pr-4 rounded-xl outline-none focus:border-[#137FEC] focus:bg-white transition-all text-[#1e293b] placeholder:text-slate-400"
                    {...otpForm.register("otp")}
                  />
                </div>
                {otpForm.formState.errors.otp && <p className="text-red-500 text-[12px]">{otpForm.formState.errors.otp.message}</p>}
              </div>

              <button
                type='submit'
                disabled={otpForm.formState.isSubmitting}
                className="cursor-pointer flex items-center justify-center w-full bg-[#137FEC] hover:bg-[#116ecf] active:scale-[0.99] py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-100/50 mt-2">
                {otpForm.formState.isSubmitting ? "Đang xác thực..." : "Xác thực mã OTP"}
              </button>

              <div className="text-center mt-4">
                {countdown > 0 ? (
                  <p className="text-[13px] text-[#64748B]">Mã OTP hết hạn sau <span className="font-bold text-[#137FEC]">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</span></p>
                ) : (
                  <button 
                    type="button"
                    onClick={() => onEmailSubmit({ email })} 
                    className="text-[13px] font-bold text-[#137FEC] hover:underline cursor-pointer"
                  >
                    Gửi lại mã OTP mới
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: Reset Password Form */}
          {step === 3 && (
            <form className="space-y-6 animate-in slide-in-from-right-10 duration-300" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <div className="space-y-2">
                <label className="font-bold text-[14px] text-[#334155] block">Mật khẩu mới</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 pl-12 pr-12 rounded-xl outline-none focus:border-[#137FEC] focus:bg-white transition-all text-[#1e293b] placeholder:text-slate-400"
                    {...passwordForm.register("newPassword")}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-slate-400 hover:text-[#137FEC] transition-colors" /> : <Eye className="h-5 w-5 text-slate-400 hover:text-[#137FEC] transition-colors" />}
                  </div>
                </div>
                {passwordForm.formState.errors.newPassword && <p className="text-red-500 text-[12px]">{passwordForm.formState.errors.newPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[14px] text-[#334155] block">Xác nhận kiểu mới</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận lại mật khẩu"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 pl-12 pr-12 rounded-xl outline-none focus:border-[#137FEC] focus:bg-white transition-all text-[#1e293b] placeholder:text-slate-400"
                    {...passwordForm.register("confirmPassword")}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-slate-400 hover:text-[#137FEC] transition-colors" /> : <Eye className="h-5 w-5 text-slate-400 hover:text-[#137FEC] transition-colors" />}
                  </div>
                </div>
                {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-[12px]">{passwordForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <button
                type='submit'
                disabled={passwordForm.formState.isSubmitting}
                className="cursor-pointer flex items-center justify-center w-full bg-[#137FEC] hover:bg-[#116ecf] active:scale-[0.99] py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-100/50 mt-2">
                {passwordForm.formState.isSubmitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </button>
            </form>
          )}

          {/* STEP 4: Success Message */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in-50 duration-500 text-center py-4">
              <CheckCircle2 className="w-24 h-24 mx-auto text-green-500 mb-6 drop-shadow-sm" />
              <button
                onClick={() => navigate('/signin')}
                className="cursor-pointer inline-flex items-center justify-center w-full bg-[#137FEC] hover:bg-[#116ecf] active:scale-[0.99] py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-100/50 mt-4">
                Đăng nhập ngay <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          )}

        </div>
      </div>

      <AuthFooter />
    </div>
  );
};

export default ForgotPasswordPages;
