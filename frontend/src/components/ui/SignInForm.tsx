import { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../../stores/useAuthStore'
import { useNavigate } from 'react-router'

const signInSchema = z.object({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
})

type SignInSchema = z.infer<typeof signInSchema>

const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
    })

    const {signin} = useAuthStore();

    const onSubmit = async (data: SignInSchema) => {
        const {username, password} = data;
        await signin(username, password);
        navigate("/");
    }
    return (
        <>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Username Field */}
                <div className="space-y-2">
                    <label htmlFor="username" className="font-bold text-[14px] text-[#334155] block">Tên đăng nhập</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tên người dùng của bạn"
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-[#137FEC] focus:bg-white transition-all text-[#1e293b] placeholder:text-slate-400"
                            {...register("username")}
                        />
                    </div>
                    {errors.username && <p className="text-red-500 text-[12px]">{errors.username.message}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className="font-bold text-[14px] text-[#334155] block">Mật khẩu</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="********"
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 pl-12 pr-12 rounded-xl outline-none focus:border-[#137FEC] focus:bg-white transition-all text-[#1e293b] placeholder:text-slate-400"
                            {...register("password")}
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-slate-400 hover:text-[#137FEC] transition-colors" />
                            ) : (
                                <Eye className="h-5 w-5 text-slate-400 hover:text-[#137FEC] transition-colors" />
                            )}
                        </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-[12px]">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className="cursor-pointer w-full bg-[#137FEC] hover:bg-[#116ecf] active:scale-[0.99] py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-100/50 mt-2">
                    Đăng nhập
                </button>

                {/* Sign Up Link */}
                <div className="pt-2 text-center text-[14px]">
                    <span className="text-[#64748B]">Chưa có tài khoản? </span>
                    <a href="/signup" className="cursor-pointer text-[#137FEC] font-bold hover:underline transition-all">Đăng ký ngay</a>
                </div>
            </form>
        </>
    )
}

export default SignInForm