import React, { useState } from "react";
import MemberCard from "./membercard";
import { type Member } from "./member";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

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
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm w-full">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Danh Sách Thành Viên
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm thành viên..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
             <div className="flex bg-white rounded-lg p-1 border border-transparent">
                 <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md whitespace-nowrap shadow-sm">
                    Người dùng tiêu biểu
                 </button>
                 <button className="px-4 py-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium rounded-md whitespace-nowrap transition-colors">
                    Thành viên mới
                 </button>
                 <button className="px-4 py-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium rounded-md whitespace-nowrap transition-colors">
                    Người bình duyệt
                 </button>
             </div>
             <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium whitespace-nowrap px-2">
                 <SlidersHorizontal size={14} />
                 Bộ lọc
             </button>
          </div>

        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-md mx-1 border border-transparent hover:border-gray-100">
             <ChevronLeft size={18} strokeWidth={2}/>
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-[4px] text-sm font-medium shadow-sm">
             1
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-[4px] text-sm font-medium transition-colors">
             2
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-[4px] text-sm font-medium transition-colors">
             3
          </button>
          <div className="w-8 h-8 flex items-center justify-center text-gray-400">
             <MoreHorizontal size={16}/>
          </div>
           <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-[4px] text-sm font-medium transition-colors">
             24
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-md mx-1 border border-transparent hover:border-gray-100">
             <ChevronRight size={18} strokeWidth={2}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
