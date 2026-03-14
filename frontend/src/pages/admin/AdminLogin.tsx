import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/authService';

const AdminLogin: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user, accessToken, setAccessToken, fetchMe } = useAuthStore();

    // Nếu đã đăng nhập là admin → redirect thẳng tới trang quản trị
    if (accessToken && user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setIsLoading(true);
            const res = await authService.adminLogin(username, password);
            setAccessToken(res.accessToken);
            await fetchMe();
            toast.success('Đăng nhập quản trị viên thành công!');
            navigate('/admin');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                        <img src="/public/logo.svg" alt="" className="w-6 h-6" />
                    </div>
                    <span className="text-[#1E293B] font-extrabold text-xl tracking-tight">DevCommunity Admin</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-[480px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Login Card */}
                    <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-white">
                        <div className="p-10 pb-8 space-y-8 text-center">
                            <div className="space-y-3">
                                <h2 className="text-[32px] font-black text-[#1E293B] leading-tight">
                                    Đăng nhập Quản trị viên
                                </h2>
                                <p className="text-[#94A3B8] font-medium">
                                    Vui lòng nhập thông tin để truy cập hệ thống điều hành
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="text-left space-y-6">
                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#64748B] ml-1">Tên đăng nhập</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#2563EB] text-[#94A3B8] transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="admin_dev"
                                            className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-2 border-[#F1F5F9] rounded-2xl outline-none focus:border-[#2563EB] focus:bg-white text-[#1E293B] font-medium transition-all placeholder:text-[#CBD5E1]"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-bold text-[#64748B]">Mật khẩu</label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#2563EB] text-[#94A3B8] transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border-2 border-[#F1F5F9] rounded-2xl outline-none focus:border-[#2563EB] focus:bg-white text-[#1E293B] font-medium transition-all placeholder:text-[#CBD5E1]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <div className="relative w-5 h-5">
                                        <input type="checkbox" className="peer hidden" />
                                        <div className="w-5 h-5 border-2 border-[#E2E8F0] rounded-md bg-white peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-all"></div>
                                        <svg className="absolute inset-0 w-3.5 h-3.5 m-auto text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Duy trì đăng nhập</span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Đang đăng nhập...' : (
                                        <>
                                            Đăng nhập hệ thống
                                            <LogIn className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Card Footer */}
                        <div className="bg-[#F8FAFC] py-4 border-t border-[#F1F5F9]">
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#94A3B8] text-center">
                                DEVCOMMUNITY SECURITY PROTOCOL V2.4
                            </p>
                        </div>
                    </div>

                    {/* Page Footer */}
                </div>
            </main>
        </div>
    );
};

export default AdminLogin;
