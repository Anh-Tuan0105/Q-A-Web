import { Home, MessageSquare, Tags, Users } from "lucide-react";
import { Link, useLocation } from "react-router";

const Sider = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Trang chủ", icon: Home, path: "/home" },
        { type: "divider", name: "CỘNG ĐỒNG" },
        { name: "Câu hỏi", icon: MessageSquare, path: "/questions" },
        { name: "Tags", icon: Tags, path: "/tags" },
        { name: "Thành viên", icon: Users, path: "/members" },
    ];

    return (
        <aside className="w-[176px] shrink-0 sticky top-[90px] h-fit ml-8">
            <nav className="flex flex-col gap-1">
                {menuItems.map((item, index) => {
                    if (item.type === "divider") {
                        return (
                            <div key={index} className="mt-6 mb-2 px-3 text-xs font-bold text-slate-400/80 dark:text-[#94a3b8]/60 uppercase tracking-wider">
                                {item.name}
                            </div>
                        );
                    }

                    let isActive = location.pathname === item.path;
                    if (item.path === "/questions" && location.pathname.startsWith("/questions")) {
                        isActive = true;
                    }

                    return (
                        <Link
                            key={index}
                            to={item.path || "#"}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[15px]
                            ${isActive
                                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#1e293b] hover:text-slate-900 dark:hover:text-[#f8fafc]"
                                }`}
                        >
                            {item.icon && <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-[#94a3b8]"}`} />}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sider;
