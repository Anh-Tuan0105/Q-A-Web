import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Sider from '../../components/sider/Sider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  description: string;
  questions: number;
  followers: number;
}

const TagsPages: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'alphabetical' | 'newest'>('popular');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - Tags
  const tags: Tag[] = [
    {
      id: 1,
      name: 'javascript',
      description: 'JavaScript (JS) là ngôn ngữ lập trình kịch bản dùa trên nguyên mẫu, đa mô hình...',
      questions: 2492103,
      followers: 548
    },
    {
      id: 2,
      name: 'python',
      description: 'Python là ngôn ngữ lập trình đa năng, cấp cao, kiểu động. Cú pháp của Python...',
      questions: 2134821,
      followers: 621
    },
    {
      id: 3,
      name: 'reactjs',
      description: 'React là thư viện JavaScript mã nguồn mở để xây dựng giao diện người dùng. Nó...',
      questions: 485321,
      followers: 654
    },
    {
      id: 4,
      name: 'node.js',
      description: 'Node.js là môi trường chạy mã JavaScript đã nên tảng, mã nguồn mở, cho phép...',
      questions: 460112,
      followers: 412
    },
    {
      id: 5,
      name: 'c#',
      description: 'C# (phát âm là "C sharp") là ngôn ngữ lập trình hiện đại, hướng đổi tương và type-..',
      questions: 1582001,
      followers: 298
    },
    {
      id: 6,
      name: 'html',
      description: 'HTML (Ngôn ngữ đánh dấu siêu văn bản) là ngôn ngữ đánh dấu tiêu chuẩn cho t...',
      questions: 1162987,
      followers: 210
    },
    {
      id: 7,
      name: 'css',
      description: 'CSS (Cascading Style Sheets) là ngôn ngữ bảng định kiểu được sử dụng để...',
      questions: 801234,
      followers: 145
    },
    {
      id: 8,
      name: 'sql',
      description: 'SQL (Ngôn ngữ truy vấn có cấu trúc) là ngôn ngữ đánh riêng cho miền được sử...',
      questions: 670453,
      followers: 201
    }
  ];

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSort = (type: 'popular' | 'alphabetical' | 'newest') => {
    setSortBy(type);
    setCurrentPage(1);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
        <Sider />

        <main className="flex-1 ml-8 pr-8 pb-12 w-full">
          {/* Page Title */}
          <h1 className="text-4xl font-bold mb-6">Thể Tags</h1>

          {/* Description */}
          <p className="text-gray-700 mb-8 leading-relaxed">
            Thể tag là từ khóa hoặc nhãn phân loại câu hỏi của bạn với các câu hỏi tương tự khác. Sử dụng thể tag giúp người khác dễ dàng tìm thấy và trả lời câu hỏi của bạn hơn.
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
                  className={`px-4 py-2 rounded font-medium transition ${
                    sortBy === 'popular'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Phổ biến nhất
                </button>
                <button
                  onClick={() => handleSort('alphabetical')}
                  className={`px-4 py-2 rounded font-medium transition ${
                    sortBy === 'alphabetical'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tên (A-Z)
                </button>
                <button
                  onClick={() => handleSort('newest')}
                  className={`px-4 py-2 rounded font-medium transition ${
                    sortBy === 'newest'
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
          <div className="grid grid-cols-4 gap-6 mb-8">
            {tags.map(tag => (
              <div key={tag.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                {/* Tag Name */}
                <a href="#" className="text-blue-500 font-bold text-lg hover:text-blue-600 transition">
                  {tag.name}
                </a>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                  {tag.description}
                </p>

                {/* Stats */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">{formatNumber(tag.questions)}</span>
                    <span className="text-gray-500">câu hỏi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">{tag.followers}</span>
                    <span className="text-gray-500">hôm nay</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button className="p-2 rounded hover:bg-gray-200 transition">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <button className="px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
              1
            </button>
            <button className="px-4 py-2 rounded hover:bg-gray-200 transition text-gray-700">
              2
            </button>
            <button className="px-4 py-2 rounded hover:bg-gray-200 transition text-gray-700">
              3
            </button>
            
            <span className="text-gray-500">...</span>
            
            <button className="px-4 py-2 rounded hover:bg-gray-200 transition text-gray-700">
              256
            </button>

            <button className="p-2 rounded hover:bg-gray-200 transition">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
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
