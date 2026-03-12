import { MapPin, Calendar, Link as LinkIcon, Github, Facebook } from "lucide-react";

interface UserProfile {
    displayName?: string;
    userName?: string;
    avatarUrl?: string;
    jobTitle?: string;
    bio?: string;
    location?: string;
    createdAt?: string;
    websitePersonal?: string;
    socialLinks?: {
        github?: string;
        facebook?: string;
    };
}

interface ProfileHeaderProps {
    user: UserProfile;
    topTags?: any[];
}

const ProfileHeader = ({ user, topTags }: ProfileHeaderProps) => {
    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#334155] shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-white dark:bg-[#1e293b] border-4 border-slate-100 dark:border-[#334155] shadow-sm">
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 dark:bg-[#334155]">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.displayName || user?.userName || "U"
                                        }&background=random&size=150`}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                    {/* Online Indicator */}
                    <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#1e293b] rounded-full"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl md:text-[32px] font-extrabold text-slate-800 dark:text-[#f8fafc] mb-1">
                        {user?.displayName || "Nguyen Van A"}
                    </h1>
                    <p className="text-[17px] font-semibold text-slate-500 dark:text-[#94a3b8] mb-2">
                        {user.jobTitle || "Thành viên Cộng đồng"}
                    </p>
                    {user.bio && (
                        <p className="text-[15px] text-slate-600 dark:text-[#94a3b8] mb-4 max-w-2xl leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5 text-[14px] font-medium text-slate-500 dark:text-[#94a3b8]">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-[18px] h-[18px]" strokeWidth={2} />
                            {user.location || "Chưa cập nhật"}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-[18px] h-[18px]" strokeWidth={2} />
                            Tham gia {new Date(user.createdAt || Date.now()).toLocaleDateString("vi-VN", { month: 'long', year: 'numeric' })}
                        </div>
                        {user.websitePersonal && (
                            <a href={user.websitePersonal.startsWith("http") ? user.websitePersonal : `https://${user.websitePersonal}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <LinkIcon className="w-[18px] h-[18px]" strokeWidth={2} />
                                {user.websitePersonal.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {(user.socialLinks?.github || user.socialLinks?.facebook) && (
                            <div className="flex flex-wrap items-center gap-6">
                                {user.socialLinks?.github && (
                                    <a href={user.socialLinks.github.startsWith("http") ? user.socialLinks.github : `https://github.com/${user.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Github className="w-[18px] h-[18px]" strokeWidth={2} />
                                        {user.socialLinks.github}
                                    </a>
                                )}
                                {user.socialLinks?.facebook && (
                                    <a href={user.socialLinks.facebook.startsWith("http") ? user.socialLinks.facebook : `https://facebook.com/${user.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Facebook className="w-[18px] h-[18px]" strokeWidth={2} />
                                        {user.socialLinks.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '')}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {topTags && topTags.length > 0 ? (
                            topTags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-[#f8fafc] font-bold text-[13px] rounded-full">
                                    {tag.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-[13px] text-slate-400 dark:text-[#94a3b8] italic">Chưa có hoạt động nổi bật</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
