import { Home, MessageSquare, Tags, Users } from "lucide-react";
import { Link, useLocation } from "react-router";

const Sider = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Trang chủ", icon: Home, path: "/" },
        { type: "divider", name: "CỘNG ĐỒNG" },
        { name: "Câu hỏi", icon: MessageSquare, path: "/questions" },
        { name: "Tags", icon: Tags, path: "/tags" },
        { name: "Thành viên", icon: Users, path: "/members" },
    ];

    return (
        <aside className="w-[176px] shrink-0 sticky top-[80px] h-fit ml-8">
            <nav className="flex flex-col gap-1">
                {menuItems.map((item, index) => {
                    if (item.type === "divider") {
                        return (
                            <div key={index} className="mt-6 mb-2 px-3 text-xs font-bold text-slate-400/80 uppercase tracking-wider">
                                {item.name}
                            </div>
                        );
                    }

                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={index}
                            to={item.path || "#"}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-[15px]
                            ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            {item.icon && <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sider;
