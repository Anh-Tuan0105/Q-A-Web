import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Check, Trash2 } from 'lucide-react';
import { useTagStore } from '../../stores/useTagStore';
import { toast } from 'sonner';

const AdminTags = () => {
    const { tags, fetchTags, createTag, updateTag, isLoading, totalTags, currentPage, totalPages } = useTagStore();
    const [searchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<any>(null);
    const [newTagName, setNewTagName] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        fetchTags(1, 5, searchTerm);
    }, [searchTerm, fetchTags]);

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName || !newTagDescription) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const success = await createTag(newTagName, newTagDescription);
        if (success) {
            setIsAddModalOpen(false);
            setNewTagName('');
            setNewTagDescription('');
        }
    };

    const handleUpdateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editDescription) {
            toast.error('Mô tả không được để trống');
            return;
        }
        const success = await updateTag(editingTag._id, editDescription);
        if (success) {
            setEditingTag(null);
            setEditDescription('');
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1a202c] mb-1">Quản lý Thẻ</h1>
                    <p className="text-[#64748b] text-[15px]">Quản lý và tổ chức các chủ đề thảo luận trên hệ thống.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Tạo thẻ mới
                </button>
            </div>

            <div className="mb-8">
                <div className="bg-white w-[280px] p-8 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-3">
                    <p className="text-[15px] font-bold text-[#64748b]">Tổng số thẻ</p>
                    <p className="text-4xl font-extrabold text-[#1a202c]">{totalTags}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-[#f1f5f9]">
                                <th className="px-8 py-5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Tên thẻ</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Mô tả</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider text-center">Số câu hỏi</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {tags.map((tag: any) => (
                                <tr key={tag._id} className="hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#eff6ff] text-[#2563eb] text-[13px] font-bold">
                                            #{tag.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[#475569] text-[14px] leading-relaxed max-w-md">
                                            {tag.description || "Chưa có mô tả chi tiết cho thẻ này."}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[#1e293b] font-bold text-[15px]">
                                            {tag.totalQuestion?.toLocaleString() || 0}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => {
                                                    setEditingTag(tag);
                                                    setEditDescription(tag.description || '');
                                                }}
                                                className="p-2 text-[#94a3b8] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-all cursor-pointer"
                                            >
                                                <Edit2 className="w-[18px] h-[18px]" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`Bạn có chắc chắn muốn xóa thẻ #${tag.name}?`)) {
                                                        const { deleteTag } = useTagStore.getState();
                                                        deleteTag(tag._id);
                                                    }
                                                }}
                                                className="p-2 text-[#94a3b8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-[18px] h-[18px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 bg-[#fcfdfe] border-t border-[#f1f5f9] flex items-center justify-between">
                    <div className="text-[14px] text-[#64748b]">
                        Hiển thị <span className="font-bold text-[#1e293b]">{(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, totalTags)}</span> trên <span className="font-bold text-[#1e293b]">{totalTags}</span> thẻ.
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => fetchTags(currentPage - 1, 5, searchTerm)}
                            disabled={currentPage === 1 || isLoading}
                            className="px-4 py-2 text-[13px] font-bold text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:border-[#ccd6e3] disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            Trang trước
                        </button>
                        
                        <div className="flex gap-1.5 mx-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => fetchTags(i + 1, 5, searchTerm)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                                        currentPage === i + 1 
                                        ? "bg-[#2563eb] text-white shadow-sm" 
                                        : "text-[#64748b] hover:bg-[#f1f5f9]"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => fetchTags(currentPage + 1, 5, searchTerm)}
                            disabled={currentPage === totalPages || isLoading}
                            className="px-4 py-2 text-[13px] font-bold text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:border-[#ccd6e3] disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Thêm Tag Mới</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTag} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên Tag</label>
                                <input 
                                    type="text" 
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Ví dụ: javascript, reactjs..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
                                <textarea 
                                    rows={4}
                                    value={newTagDescription}
                                    onChange={(e) => setNewTagDescription(e.target.value)}
                                    placeholder="Mô tả ngắn gọn về tag này..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Đang tạo...' : <><Check className="w-4 h-4" /> Tạo Tag</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingTag && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-900">Sửa mô tả Tag</h2>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-sm font-bold rounded">
                                    {editingTag.name}
                                </span>
                            </div>
                            <button onClick={() => setEditingTag(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTag} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả mới</label>
                                <textarea 
                                    rows={5}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Cập nhật mô tả để người dùng hiểu rõ hơn về tag này..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditingTag(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Đang lưu...' : <><Check className="w-4 h-4" /> Lưu thay đổi</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTags;
