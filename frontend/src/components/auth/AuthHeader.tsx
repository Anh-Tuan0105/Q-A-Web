import React from 'react';
import { Link } from 'react-router';
import { useAdminSettingsStore } from '../../stores/useAdminSettingsStore';

interface AuthHeaderProps {
    type: 'signin' | 'signup';
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ type }) => {
    const isSignUp = type === 'signup';
    const logoUrl = useAdminSettingsStore((s) => s.logoUrl);
    const siteName = useAdminSettingsStore((s) => s.siteName);

    return (
        <div className="w-full bg-white border-b border-slate-200/50">
            <div className="container px-4">
                <header className="flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-x-4 cursor-pointer text-decoration-none">
                        <div className="w-8 h-8">
                            <img src={logoUrl} alt={`${siteName} Logo`} className="object-cover" />
                        </div>
                        <div className="font-bold text-[20px] text-[#0F172A]">{siteName}</div>
                    </Link>
                    <div className="flex items-center gap-x-4">
                        <div className="font-normal text-[14px] text-[#475569]">
                            {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                        </div>
                        <Link
                            to={isSignUp ? '/signin' : '/signup'}
                            className="font-semibold text-[14px] text-[#137FEC] hover:underline"
                        >
                            {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
                        </Link>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default AuthHeader;
