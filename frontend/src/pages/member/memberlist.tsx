import React, { useState } from "react";
import MemberCard from "./membercard";
import { type Member } from "./member";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Header from "../../components/header/Header";
import Sider from "../../components/sider/Sider";
import Footer from "../../components/footer/Footer";

const MemberList: React.FC = () => {
  // Mock data matching the design
  const [members] = useState<Member[]>([
    {
      id: 1,
      name: "Huy Nguyễn",
      location: "Hà Nội, VN",
      reputation: 12450,
      postCount: 458,
      tags: ["javascript", "reactjs", "nodejs"],
      avatar: "https://i.pravatar.cc/150?u=huy",
      isVip: true,
    },
    {
      id: 2,
      name: "Sarah Trần",
      location: "TP. HCM, VN",
      reputation: 8932,
      postCount: 215,
      tags: ["typescript", "frontend", "css"],
      avatar: "https://i.pravatar.cc/150?u=sarah",
      isVip: false,
    },
    {
      id: 3,
      name: "David Lee",
      location: "Da Nang, VN",
      reputation: 15200,
      postCount: 620,
      tags: ["docker", "backend", "go"],
      avatar: "https://i.pravatar.cc/150?u=david",
      isVip: false,
    },
    {
      id: 4,
      name: "Linh Vũ",
      location: "Singapore",
      reputation: 4120,
      postCount: 98,
      tags: ["ui-design", "figma", "css"],
      avatar: "https://i.pravatar.cc/150?u=linh",
      isVip: false,
    },
    // Row 2
    {
      id: 5,
      name: "Khoa Phạm",
      location: "Remote",
      reputation: 2850,
      postCount: 45,
      tags: ["python", "django", "aws"],
      avatar: "https://ui-avatars.com/api/?name=KP&background=9b51e0&color=fff&size=150",
      isVip: false,
    },
    {
      id: 6,
      name: "Thanh Nguyễn",
      location: "Hà Nội, VN",
      reputation: 1240,
      postCount: 28,
      tags: ["java", "spring", "microservices"],
      avatar: "https://ui-avatars.com/api/?name=TN&background=eb5757&color=fff&size=150",
      isVip: false,
    },
    {
      id: 7,
      name: "Minh Anh",
      location: "TP. HCM, VN",
      reputation: 6530,
      postCount: 156,
      tags: ["flutter", "dart", "mobile"],
      avatar: "https://ui-avatars.com/api/?name=MA&background=27ae60&color=fff&size=150",
      isVip: false,
    },
    {
      id: 8,
      name: "John B",
      location: "New York, USA",
      reputation: 22100,
      postCount: 890,
      tags: ["rust", "wasm", "systems"],
      avatar: "https://ui-avatars.com/api/?name=JB&background=f2994a&color=fff&size=150",
      isVip: false,
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
        <Sider />

        {/* Main Content Area */}
        <div className="flex-1 ml-8 pr-8 pb-12 w-full">
          <div className="max-w-[1200px] mx-auto">
            {/* Header Section */}
            <h1 className="text-[28px] font-extrabold text-slate-800 mb-6">
              Danh Sách Thành Viên
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

              {/* Search Bar */}
              <div className="relative w-full md:w-[450px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm thành viên..."
                  className="w-[400px] pl-12 pr-4 py-[10px] bg-[#F8F9FA] border border-slate-200 rounded-xl text-[15px] text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="flex bg-white rounded-lg p-1 border border-transparent">
                  <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-md whitespace-nowrap shadow-sm">
                    Người dùng tiêu biểu
                  </button>
                  <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold rounded-md whitespace-nowrap transition-colors">
                    Thành viên mới
                  </button>
                  <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold rounded-md whitespace-nowrap transition-colors">
                    Người bình duyệt
                  </button>
                </div>
                <button className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 text-sm font-bold whitespace-nowrap px-2">
                  <SlidersHorizontal size={14} />
                  Bộ lọc
                </button>
              </div>

            </div>

            {/* Grid System */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-md mx-1 border border-transparent hover:border-slate-100">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors">
                  3
                </button>
                <div className="w-8 h-8 flex items-center justify-center text-slate-400">
                  <MoreHorizontal size={16} />
                </div>
                <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors">
                  24
                </button>
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-md mx-1 border border-transparent hover:border-slate-100">
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div >
  );
};

export default MemberList;
