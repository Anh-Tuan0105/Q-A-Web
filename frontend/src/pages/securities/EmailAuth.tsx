import { Mail, ArrowRight, HelpCircle } from "lucide-react";

const EmailAuth = () => {

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
              Chúng tôi đã gửi mã OTP 6 chữ số đến email mới của bạn
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-between gap-3 mb-10">
            {['•', '•', '•', '•', '•', '•'].map((_, idx) => (
              <div
                key={idx}
                className="w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-2xl border-2 border-slate-50 bg-slate-50/50 text-slate-300 transition-all font-bold text-[24px]"
              >
                •
              </div>
            ))}
          </div>

          {/* Confirm Button */}
          <button
            className="w-full py-4 bg-[#1877F2] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(24,119,242,0.25)] transition-all flex items-center justify-center gap-2 group mb-6"
          >
            Xác nhận mã
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Resend Timer */}
          <div className="text-center">
            <p className="text-[14px] font-medium text-slate-400">
              Không nhận được mã? <span className="text-blue-500 cursor-pointer hover:underline underline-offset-4">Gửi lại sau 59s</span>
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
