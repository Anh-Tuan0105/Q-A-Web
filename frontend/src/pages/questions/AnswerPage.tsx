import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Bookmark, Clock } from 'lucide-react';
import Header from '../../components/header/Header';
import Sider from '../../components/sider/Sider';

interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  createdAt: string;
  views: number;
  replies: number;
  votes: number;
  tags: string[];
  codeBlock?: string;
}

interface Answer {
  id: number;
  content: string;
  author: string;
  avatar: string;
  createdAt: string;
  votes: number;
  isAccepted?: boolean;
}

const AnswerPage: React.FC = () => {
  const [userInfo] = useState({ name: 'Minh Hoàng', avatar: 'MH' });
  const [answerText, setAnswerText] = useState('');
  const [votes, setVotes] = useState(12);

  // Mock data - Question
  const question: Question = {
    id: 1,
    title: 'Làm thế nào để tối ưu hóa hiệu năng React component khi render list lớn?',
    content: 'Tôi đang xây dựng một ứng dụng hiển thị danh sách khoảng 10.000 items. Hiện tại, mỗi khi tôi cập nhật state của một item, cả danh sách bị re-render và ứng dụng bị lag rất nhiều. Đây là câu trúc code hiện tại của tôi:',
    author: 'Minh Hoàng',
    avatar: 'MH',
    createdAt: 'hôm nay',
    views: 142,
    replies: 0,
    votes: 12,
    tags: ['javascript', 'reactjs', 'performance'],
    codeBlock: `const MyList = ({ items }) => {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
};`
  };

  // Mock data - Answers
  const answers: Answer[] = [
    {
      id: 1,
      content: 'Tôi đã thu dụng React.memo cho ListItem nhằ ng không thấy một hiện hiệu năng đáng kg. Tôi có nghe nói về Virtualization nhưng chắc bạn biết báu dụ tt đầu.',
      author: 'Nguyễn Văn A',
      avatar: 'NVA',
      createdAt: '2 ngày trước',
      votes: 5,
      isAccepted: true
    },
    {
      id: 2,
      content: 'Bạn có thể sử dụng thư viện như react-window hoặc react-virtualized để xử lý liste lớn. Những thư viện này sẽ chỉ render các item hiển thị trên màn hình.',
      author: 'Trần Thị B',
      avatar: 'TTB',
      createdAt: '1 ngày trước',
      votes: 3
    }
  ];

  // Mock data - Popular Tags
  const popularTags = [
    { name: 'javascript', count: 23 },
    { name: 'python', count: 18 },
    { name: 'reactjs', count: 15 },
    { name: 'typescript', count: 12 }
  ];

  const handleAnswerSubmit = () => {
    if (answerText.trim()) {
      alert('Câu trả lời đã được gửi!');
      setAnswerText('');
    } else {
      alert('Vui lòng nhập nội dung câu trả lời');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">

        {/* Sider Area */}
        <Sider />

        {/* Main Content Area */}
        <main className="flex-1 ml-8 pr-8 pb-12 w-full">
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2">
              {/* Question Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-3">
                      {question.title}
                    </h1>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span>Đã hỏi {question.createdAt}</span>
                      <span>Đã xem {question.views} lần</span>
                      <span>Hoạt động {question.createdAt}</span>
                    </div>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    + Hỏi câu hỏi
                  </button>
                </div>

                <hr className="my-4" />

                {/* Question Content */}
                <div className="flex gap-6">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => setVotes(votes + 1)}
                      className="text-gray-500 hover:text-orange-500 transition"
                    >
                      <ThumbsUp size={24} />
                    </button>
                    <span className="text-xl font-bold">{votes}</span>
                    <button 
                      onClick={() => setVotes(votes - 1)}
                      className="text-gray-500 hover:text-orange-500 transition"
                    >
                      <ThumbsDown size={24} />
                    </button>
                    <button className="text-gray-500 hover:text-yellow-500 transition mt-2">
                      <Bookmark size={24} />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {question.content}
                    </p>
                    
                    {question.codeBlock && (
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                        <pre>{question.codeBlock}</pre>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {question.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <hr className="my-4" />

                    {/* Author Info */}
                    <div className="flex justify-end items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-sm">{question.author}</div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {question.createdAt}
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-green-400 text-white rounded-full flex items-center justify-center font-bold">
                        {question.avatar}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {answers.length} Câu Trả Lời
                </h2>
                
                {answers.map(answer => (
                  <div key={answer.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <button className="text-gray-500 hover:text-orange-500 transition">
                          <ThumbsUp size={20} />
                        </button>
                        <span className="font-bold">{answer.votes}</span>
                        <button className="text-gray-500 hover:text-orange-500 transition">
                          <ThumbsDown size={20} />
                        </button>
                        {answer.isAccepted && (
                          <div className="text-green-500 text-sm font-bold mt-2">✓</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {answer.content}
                        </p>
                        <hr className="my-4" />
                        <div className="flex justify-end items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-sm">{answer.author}</div>
                            <div className="text-gray-600 text-xs flex items-center gap-1">
                              <Clock size={12} />
                              {answer.createdAt}
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {answer.avatar}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Answer Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Câu trả lời của bạn</h3>
                
                <div className="space-y-4">
                  <div>
                    <textarea
                      rows={8}
                      placeholder="Nhập câu trả lời của bạn..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <button 
                    onClick={handleAnswerSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition"
                  >
                    Đăng câu trả lời
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Tags */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-bold mb-4">Tags phổ biến</h3>
                <div className="space-y-2">
                  {popularTags.map(tag => (
                    <div 
                      key={tag.name}
                      className="flex justify-between items-center p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <span className="text-blue-500 font-medium">{tag.name}</span>
                      <span className="text-gray-600 text-sm">{tag.count}K CÂU HỎI</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a href="#" className="text-blue-500 hover:text-blue-600">Xem tất cả tags →</a>
                </div>
              </div>

              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                    {userInfo.avatar}
                  </div>
                  <h4 className="font-bold text-sm mb-4">{userInfo.name}</h4>
                  <div className="space-y-2">
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">
                      Xem hồ sơ
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">
                      Cài đặt
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

export default AnswerPage;
