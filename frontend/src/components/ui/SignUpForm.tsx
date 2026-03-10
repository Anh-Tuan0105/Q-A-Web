import { Mail, User, Lock, UserRoundPlus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router';

const signUpSchema = z.object({
    firstname: z.string().min(1, "Vui lòng nhập tên"),
    lastname: z.string().min(1, "Vui lòng nhập họ"),
    username: z.string().min(3, "Vui lòng nhập tên đăng nhập"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type SignUpSchema = z.infer<typeof signUpSchema>

const SignUpForm = () => {
    const { signup } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    })

    const onSubmit = async (data: SignUpSchema) => {
        const { firstname, lastname, username, email, password } = data;
        const success = await signup(username, password, email, firstname, lastname);
        if (success) {
            navigate("/signin");
        }
    }
    return (
        <>
            <form className="pt-25.75 pb-25.75 pr-16.25 pl-16.25" onSubmit={handleSubmit(onSubmit)}>
                <div className="font-bold text-[24px] text-[#0F172A] mb-2">Đăng ký tài khoản</div>
                <p className="font-normal text-[16px] text-[#64748B] mb-10 block">Bắt đầu hành trình của bạn ngay hôm nay</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="lastname" className="font-semibold text-[14px] text-[#334155]">Họ</label>
                        <input
                            type="text"
                            id="lastname"
                            placeholder="Nguyễn"
                            className="border border-slate-200 pt-3.5 pb-3.5 pr-4 pl-4 rounded-lg outline-none"
                            {...register("lastname")}
                        />
                        {errors.lastname && <p className="text-red-500 text-[12px]">{errors.lastname.message}</p>}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="firstname" className="font-semibold text-[14px] text-[#334155]">Tên</label>
                        <input
                            type="text"
                            id="firstname"
                            placeholder="An"
                            className="border border-slate-200 pt-3.5 pb-3.5 pr-4 pl-4 rounded-lg outline-none"
                            {...register("firstname")}
                        />
                        {errors.firstname && <p className="text-red-500 text-[12px]">{errors.firstname.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                    <label htmlFor="username" className="font-semibold text-[14px] text-[#334155]">Tên đăng nhập (Username)</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            placeholder="nguyenan_dev"
                            className="w-full border border-slate-200 py-3.5 pl-11 pr-4 rounded-lg outline-none focus:border-[#137FEC] transition-all"
                            {...register("username")}
                        />
                    </div>
                    {errors.username && <p className="text-red-500 text-[12px]">{errors.username.message}</p>}
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                    <label htmlFor="email" className="font-semibold text-[14px] text-[#334155]">Email</label>
                    <div className="relative group">
                        {/* Icon Container */}
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                        </div>
                        {/* Input: Thêm pl-11 để tránh đè chữ lên icon */}
                        <input
                            type="email"
                            id="email"
                            placeholder="email@example.com"
                            className="w-full border border-slate-200 pt-3.5 pb-3.5 pr-4 pl-11 rounded-lg outline-none focus:border-[#137FEC] transition-all"
                            {...register("email")} />
                    </div>
                    {errors.email && <p className="text-red-500 text-[12px]">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                    <label htmlFor="password" className="font-semibold text-[14px] text-[#334155]">Mật khẩu</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#137FEC] transition-colors" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            placeholder="Tối thiểu 6 ký tự"
                            className="w-full border border-slate-200 py-3.5 pl-11 pr-4 rounded-lg outline-none focus:border-[#137FEC] transition-all"
                            {...register("password")} />
                    </div>
                    {errors.password && <p className="text-red-500 text-[12px]">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    className="cursor-pointer w-full bg-[#137FEC] hover:bg-[#116ecf] active:scale-[0.98] py-3.5 rounded-lg font-bold text-white mb-8 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-x-2"
                    disabled={isSubmitting}
                >
                    {/* Thêm Icon ở đây */}
                    <UserRoundPlus className="h-5 w-5" />
                    <span>Tạo tài khoản</span>
                </button>
                <p className="font-normal text-[12px] text-[#94A3B8] text-center">Bằng cách nhấn tạo tài khoản, bạn xác nhận đồng ý với các quy định
                    chung của cộng đồng.</p>
            </form>
        </>
    )
}

export default SignUpForm