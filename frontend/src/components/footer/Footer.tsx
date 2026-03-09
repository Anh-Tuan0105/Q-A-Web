import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-auto py-8">
            <div className="max-w-[1400px] w-full mx-auto px-8 flex justify-between items-center">

                {/* Left Side: Logo & Copyright */}
                <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="DevCommunity Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-slate-700 text-[15px]">DevCommunity &copy; 2024</span>
                </div>

                {/* Right Side: Links */}
                <div className="flex items-center gap-8 text-[14px] font-semibold text-slate-500">
                    <Link to="/about" className="hover:text-blue-600 transition-colors">Về chúng tôi</Link>
                    <Link to="/advertising" className="hover:text-blue-600 transition-colors">Quảng cáo</Link>
                    <Link to="/terms" className="hover:text-blue-600 transition-colors">Điều khoản</Link>
                    <Link to="/privacy" className="hover:text-blue-600 transition-colors">Bảo mật</Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
