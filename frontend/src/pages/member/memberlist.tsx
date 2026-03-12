import React, { useState, useEffect } from "react";
import MemberCard from "../../components/members/membercard";
import { type Member } from "../../components/members/member";
import { Search, ChevronLeft, ChevronRight, MessageSquareOff } from "lucide-react";
import Header from "../../components/header/Header";
import Sider from "../../components/sider/Sider";
import Footer from "../../components/footer/Footer";
import { userService } from "../../services/userService";
import Loading from "../../components/ui/Loading";

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"reputation" | "newest">("reputation");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const res = await userService.getMembers(page, 8, searchQuery, sort);
        if (res.success) {
          setMembers(res.data);
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.totalItems);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách thành viên:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [page, searchQuery, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(keyword);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
        <Sider />

        {/* Main Content Area */}
        <div className="flex-1 ml-8 pr-8 pb-12 w-full">
          <div className="max-w-[1200px] mx-auto">
            {/* Header Section */}
            <h1 className="text-[28px] font-extrabold text-slate-800 dark:text-[#f8fafc] mb-6">
              Danh Sách Thành Viên ({totalItems})
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative w-full md:w-[450px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94a3b8]" size={20} />
                <input
                  type="text"
                  placeholder="Tìm thành viên..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full md:w-[400px] pl-12 pr-4 py-[10px] bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl text-[15px] text-slate-600 dark:text-[#f8fafc] placeholder:text-slate-400 dark:placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              </form>

              {/* Filters */}
              <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="flex bg-white dark:bg-[#1e293b] rounded-lg p-1 border border-slate-200 dark:border-[#334155] shadow-sm">
                  <button
                    onClick={() => { setSort("reputation"); setPage(1); }}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md whitespace-nowrap transition-all ${sort === "reputation" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 dark:text-[#94a3b8] hover:text-slate-800 dark:hover:text-[#f8fafc]"}`}
                  >
                    Người dùng tiêu biểu
                  </button>
                  <button
                    onClick={() => { setSort("newest"); setPage(1); }}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md whitespace-nowrap transition-all ${sort === "newest" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 dark:text-[#94a3b8] hover:text-slate-800 dark:hover:text-[#f8fafc]"}`}
                  >
                    Thành viên mới
                  </button>
                </div>
              </div>

            </div>

            {/* Grid System */}
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <Loading message="Đang tải danh sách thành viên..." />
              </div>
            ) : members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white dark:bg-[#1e293b] rounded-2xl border border-dashed border-slate-200 dark:border-[#334155]">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 dark:bg-[#334155] rounded-2xl mb-4">
                  <MessageSquareOff className="w-8 h-8 text-slate-300 dark:text-[#94a3b8]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-[#f8fafc]">Không tìm thấy thành viên</h3>
                <p className="text-slate-500 dark:text-[#94a3b8] max-w-xs mx-auto mt-2">Thử điều chỉnh từ khóa tìm kiếm hoặc các bộ lọc của bạn.</p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-slate-400 dark:text-[#94a3b8] hover:text-blue-600 hover:border-blue-100 dark:hover:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>

                <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-1 shadow-sm">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setPage(idx + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${page === idx + 1 ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#334155]"}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-slate-400 dark:text-[#94a3b8] hover:text-blue-600 hover:border-blue-100 dark:hover:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div >
  );
};

export default MemberList;
