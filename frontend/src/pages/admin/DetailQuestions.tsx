import React from 'react';
import { useParams, Link } from 'react-router';
import { AlertCircle, Search, Bell, CheckCircle, XCircle, Trash2, ArrowLeft } from 'lucide-react';

const DetailQuestions: React.FC = () => {
    const { id: _id } = useParams();

    // Mock data based on the provided image
    const post = {
        reportReason: 'Nội dung gây hiểu lầm hoặc sai lệch',
        reporter: '@user_123',
        reportDate: '24/05/2024',
        title: 'Cách sử dụng React Hooks hiệu quả trong dự án thực tế',
        author: 'Nguyễn Văn A',
        postDate: '22 tháng 5, 2024',
        readTime: '12 phút đọc',
        tags: ['REACT', 'JAVASCRIPT', 'WEB DEVELOPMENT'],
        content: `React Hooks đã thay đổi hoàn toàn cách chúng ta xây dựng các component. Tuy nhiên, việc lạm dụng hoặc sử dụng sai quy tắc của Hooks có thể dẫn đến các lỗi khó debug như vòng lặp vô tận (infinite loops) hoặc memory leaks.

Dưới đây là một ví dụ về cách sử dụng useEffect để fetching data đúng cách:`,
        codeSnippet: `const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchData().then(res => {
      if (isMounted) setData(res);
    });
    return () => { isMounted = false };
  }, []);

  return <div>{data}</div>;
}`,
        footerText: 'Sử dụng useMemo và useCallback cũng rất quan trọng để tối ưu hóa hiệu năng, tránh việc re-render không cần thiết của các component con.',
        comments: [
            { id: 1, author: 'Trần Thị B', time: '2 giờ trước', content: 'Bài viết rất chi tiết, phần giải thích về isMounted trong useEffect thực sự cần thiết cho newbie.', badge: 'HỮU ÍCH' },
            { id: 2, author: 'Lê Văn C', time: '1 giờ trước', content: 'Tại sao bạn lại khuyên dùng useMemo cho mọi trường hợp? Tôi nghĩ nó có thể làm chậm app nếu dùng quá đà.' },
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Link to="/admin/posts" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <ArrowLeft size={20} />
                    </Link>
                    Xem xét bài viết bị báo cáo
                </h2>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-500 relative cursor-pointer">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>

            {/* Report Warning Banner */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg">
                    <AlertCircle className="text-red-500" size={20} />
                </div>
                <div>
                    <h3 className="text-red-700 font-bold text-sm">Lý do báo cáo: {post.reportReason}</h3>
                    <p className="text-red-600 text-xs mt-1">
                        Người báo cáo: <span className="font-semibold">{post.reporter}</span> • Ngày báo cáo: {post.reportDate}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8">
                {/* Tags */}
                <div className="flex gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title & Author */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                            alt={post.author}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{post.author}</p>
                            <p className="text-xs text-gray-400">Đăng ngày {post.postDate} • {post.readTime}</p>
                        </div>
                    </div>
                </div>

                {/* Post Body */}
                <div className="prose max-w-none text-gray-700 leading-relaxed text-sm">
                    <p className="whitespace-pre-line">{post.content}</p>
                </div>

                {/* Mock Code Block */}
                <div className="bg-[#2d2d2d] rounded-xl p-6 overflow-x-auto">
                    <pre className="text-gray-300 font-mono text-sm leading-6">
                        <code>{post.codeSnippet}</code>
                    </pre>
                </div>

                <div className="text-gray-700 leading-relaxed text-sm">
                    <p>{post.footerText}</p>
                </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pb-20">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Search size={20} className="rotate-90" /> {/* Just for the icon style */}
                    Thảo luận ({post.comments.length})
                </h3>
                <div className="space-y-4">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`}
                                alt={comment.author}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-sm text-gray-900">{comment.author}</span>
                                        <span className="text-xs text-gray-400 ml-2">{comment.time}</span>
                                    </div>
                                    {comment.badge && (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded">
                                            {comment.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-100 p-4 flex justify-center gap-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <button className="px-8 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                    <XCircle size={18} />
                    Bỏ qua
                </button>
                <button className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 flex items-center gap-2 cursor-pointer">
                    <Trash2 size={18} />
                    Gỡ bỏ bài viết
                </button>
                <button className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 flex items-center gap-2 cursor-pointer">
                    <CheckCircle size={18} />
                    Duyệt bài
                </button>
            </div>
        </div>
    );
};

export default DetailQuestions;
