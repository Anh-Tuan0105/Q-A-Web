import { Link } from "react-router";
import { useAdminSettingsStore } from "../../stores/useAdminSettingsStore";

const Footer = () => {
    const logoUrl = useAdminSettingsStore((s) => s.logoUrl);
    const siteName = useAdminSettingsStore((s) => s.siteName);

    return (
        <footer className="bg-slate-50 dark:bg-[#1e293b] border-t border-slate-200 dark:border-[#334155] mt-auto py-8">
            <div className="max-w-[1400px] w-full mx-auto px-8 flex justify-between items-center">

                {/* Left Side: Logo & Copyright */}
                <div className="flex items-center gap-3">
                    <img src={logoUrl} alt={`${siteName} Logo`} className="w-8 h-8 object-contain dark:invert-[0.1]" />
                    <span className="font-bold text-slate-700 dark:text-[#f8fafc] text-[15px]">{siteName} &copy; 2026</span>
                </div>

                {/* Right Side: Links */}
                <div className="flex items-center gap-8 text-[14px] font-semibold text-slate-500 dark:text-[#94a3b8]">
                    <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Về chúng tôi</Link>
                    <Link to="/advertising" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Quảng cáo</Link>
                    <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Điều khoản</Link>
                    <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bảo mật</Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
