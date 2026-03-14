const AuthFooter = () => {
    return (
        <footer className="py-8 bg-white text-center border-t border-slate-100 w-full">
            <p className="text-[12px] text-[#94A3B8] mb-2 font-medium">
                © {new Date().getFullYear()} DevCommunity Platform. All rights reserved.
            </p>
            <div className="flex justify-center gap-x-6">
                <a href="#" className="text-[12px] text-[#94A3B8] hover:text-[#137FEC] transition-colors">Điều khoản</a>
                <a href="#" className="text-[12px] text-[#94A3B8] hover:text-[#137FEC] transition-colors">Bảo mật</a>
                <a href="#" className="text-[12px] text-[#94A3B8] hover:text-[#137FEC] transition-colors">Liên hệ</a>
            </div>
        </footer>
    )
}

export default AuthFooter
