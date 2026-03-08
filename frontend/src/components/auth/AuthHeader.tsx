import React from 'react';

interface AuthHeaderProps {
    type: 'signin' | 'signup';
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ type }) => {
    const isSignUp = type === 'signup';

    return (
        <div className="container bg-[#FFFFFFCC] border-b border-slate-200/50">
            <header className="flex items-center justify-between mt-3 mb-3">
                <div className="flex items-center gap-x-4">
                    <div className="w-8 h-8">
                        <img src="/logo.svg" alt="DevCommunity Logo" className="object-cover" />
                    </div>
                    <div className="font-bold text-[20px] text-[#0F172A]">DevCommunity</div>
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="font-normal text-[14px] text-[#475569]">
                        {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                    </div>
                    <a
                        href={isSignUp ? '/signin' : '/signup'}
                        className="font-semibold text-[14px] text-[#137FEC]"
                    >
                        {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
                    </a>
                </div>
            </header>
        </div>
    );
};

export default AuthHeader;
