import AuthHeader from '../../components/auth/AuthHeader'
import SignInForm from '../../components/ui/SignInForm'
import AuthFooter from '../../components/auth/AuthFooter'


const SignInPages = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader type="signin" />

      <div className="flex-1 bg-linear-to-b from-blue-100 to-white flex items-center justify-center py-12 px-4 shadow-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-120">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="font-extrabold text-[32px] text-[#0F172A] mb-2 leading-tight">Chào mừng trở lại</h1>
            <p className="font-medium text-[15px] text-[#64748B] max-w-75 mx-auto">
              Cộng đồng hỏi đáp và chia sẻ kiến thức lập trình
            </p>
          </div>
          <SignInForm />
        </div>
      </div>

      <AuthFooter />
    </div>
  )
}

export default SignInPages
