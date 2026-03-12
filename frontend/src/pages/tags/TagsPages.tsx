import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Sider from '../../components/sider/Sider';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useTagStore } from '../../stores/useTagStore';

const TagsPages: React.FC = () => {
  const navigate = useNavigate();
  const { tags, isLoading, fetchTags, currentPage, totalPages } = useTagStore();

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'alphabetical' | 'newest'>('popular');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    fetchTags(currentPage, 16, debouncedSearch, sortBy);
  }, [debouncedSearch, sortBy, currentPage, fetchTags]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (currentPage !== 1) {
      useTagStore.setState({ currentPage: 1 });
    }
  };

  const handleSort = (type: 'popular' | 'alphabetical' | 'newest') => {
    setSortBy(type);
    if (currentPage !== 1) {
      useTagStore.setState({ currentPage: 1 });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    useTagStore.setState({ currentPage: newPage });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
        <Sider />

        <main className="flex-1 ml-8 pr-8 pb-12 w-full">
          {/* Page Title */}
          <h1 className="text-[28px] font-extrabold text-slate-800 mb-3">Thẻ Tags</h1>

          {/* Description */}
          <p className="text-gray-700 mb-8 leading-relaxed">
            Thẻ tag là từ khóa hoặc nhãn phân loại câu hỏi của bạn với các câu hỏi tương tự khác. Sử dụng thể tag giúp người khác dễ dàng tìm thấy và trả lời câu hỏi của bạn hơn.
          </p>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex gap-4 items-center justify-between">
              {/* Search Box */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Lọc theo tên thẻ..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleSort('popular')}
                  className={`px-4 py-2 rounded font-medium transition ${sortBy === 'popular'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Phổ biến nhất
                </button>
                <button
                  onClick={() => handleSort('alphabetical')}
                  className={`px-4 py-2 rounded font-medium transition ${sortBy === 'alphabetical'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Tên (A-Z)
                </button>
                <button
                  onClick={() => handleSort('newest')}
                  className={`px-4 py-2 rounded font-medium transition ${sortBy === 'newest'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Mới nhất
                </button>
              </div>
            </div>
          </div>

          {/* Tags Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : tags.length === 0 ? (
            <div className="flex justify-center py-20 bg-white rounded-lg shadow-sm">
              <span className="text-slate-500 font-medium">Không tìm thấy thẻ nào phù hợp.</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 mb-8">
              {tags.map(tag => (
                <div key={tag._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/questions?tag=${encodeURIComponent(tag.name)}`)}>
                  {/* Tag Name */}
                  <Link to={`/questions?tag=${encodeURIComponent(tag.name)}`} className="text-blue-500 font-bold text-lg hover:text-blue-600 transition">
                    {tag.name}
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3 h-10">
                    {tag.description || `Thẻ mô tả chủ đề liên quan đến ${tag.name}`}
                  </p>

                  {/* Stats */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-semibold">{formatNumber(tag.totalQuestion || 0)}</span>
                      <span className="text-gray-500">câu hỏi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-semibold">{formatNumber(tag.viewCount || 0)}</span>
                      <span className="text-gray-500">lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const p = index + 1;
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`px-4 py-2 rounded font-medium transition ${currentPage === p
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                      {p}
                    </button>
                  );
                } else if (p === currentPage - 2 || p === currentPage + 2) {
                  return <span key={p} className="text-gray-500 px-2">...</span>
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1400px] w-full mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-sm">A</div>
              <div className="w-8 h-8 bg-green-400 rounded flex items-center justify-center font-bold text-sm">D</div>
              <span className="font-bold text-gray-800 ml-2">DevCommunity © 2024</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition">Về chúng tôi</a>
              <a href="#" className="hover:text-gray-900 transition">Quảng cáo</a>
              <a href="#" className="hover:text-gray-900 transition">Điều khoản</a>
              <a href="#" className="hover:text-gray-900 transition">Bảo mật</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TagsPages;
