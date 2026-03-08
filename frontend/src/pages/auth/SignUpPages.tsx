import computer from '../../assets/computer.jpg'
import AuthHeader from '../../components/auth/AuthHeader'
import SignUpForm from '../../components/ui/SignUpForm'
import AuthFooter from '../../components/auth/AuthFooter'



const SignUpPages = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader type="signup" />
      <div className="flex-1 bg-linear-to-b from-blue-100 to-white">
        <div className="container pt-12 pb-12 flex">
          {/* Trái */}
          <div className="bg-[#F8FAFC80] border-r border-slate-100 w-135 p-12 rounded-l-[20px]">
            <h1 className="font-extrabold text-[36px] text-[#0F172A] mb-6">Gia nhập cộng đồng
              <span className="font-extrabold text-[36px] text-[#137FEC]"> lập trình viên</span> lớn nhất</h1>
            <div className="flex flex-col gap-y-8 mb-5">
              <div className="">
                <div className="font-bold text-[18px] text-[#0F172A]">Hỏi & Đáp chuyên sâu</div>
                <p className="font-normal text-[16px] text-[#475569]">Giải quyết mọi vấn đề kỹ thuật từ cơ bản đến nâng
                  cao cùng các chuyên gia.</p>
              </div>
              <div className="">
                <div className="font-bold text-[18px] text-[#0F172A]">Hệ thống Huy hiệu</div>
                <p className="font-normal text-[16px] text-[#475569]">Xây dựng uy tín cá nhân và nhận phần thưởng qua
                  việc đóng góp tri thức.</p>
              </div>
              <div className="">
                <div className="font-bold text-[18px] text-[#0F172A]">Kết nối không giới hạn</div>
                <p className="font-normal text-[16px] text-[#475569]">Tìm kiếm cộng sự, mentor và mở rộng mạng lưới
                  quan hệ trong ngành IT.</p>
              </div>
            </div>
            <div className="w-113 h-63 rounded-xl shadow-md overflow-hidden">
              <img src={computer} alt="" className="object-cover w-full h-full" />
            </div>
          </div>
          {/* Phải */}
          <div className="flex-1 bg-[white] rounded-r-[20px]">
            <SignUpForm />
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}

export default SignUpPages
