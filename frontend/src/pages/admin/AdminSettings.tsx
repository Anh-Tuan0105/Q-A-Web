import { useState } from 'react';
import { LayoutTemplate, Wrench } from 'lucide-react';

const AdminSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Cài đặt Hệ thống</h1>
          <p className="text-gray-500 text-[15px]">
            Cấu hình danh tính thương hiệu, chế độ vận hành và thông tin liên hệ cho hệ thống của bạn.
          </p>
        </div>

        <div className="space-y-6">
          {/* Nhận diện thương hiệu Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
              <span className="text-blue-500 bg-blue-50 p-1.5 rounded-md">
                <LayoutTemplate className="w-5 h-5" />
              </span>
              Nhận diện thương hiệu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Tên Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Website
                </label>
                <input
                  type="text"
                  defaultValue="Tech Enthusiasts Hub"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px]"
                />
              </div>

              {/* Email Hệ thống */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Hệ thống
                </label>
                <input
                  type="email"
                  defaultValue="admin@community.io"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px]"
                />
              </div>

              {/* Tải lên Logo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tải lên Logo
                </label>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm">
                    Chọn tệp
                  </button>
                  <span className="text-xs text-gray-400">Tối đa 2MB. SVG, PNG hoặc JPG.</span>
                </div>
              </div>

              {/* Tải lên Favicon */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tải lên Favicon
                </label>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm">
                    Chọn tệp
                  </button>
                  <span className="text-xs text-gray-400">Định dạng .ico hoặc .png (16x16, 32x32).</span>
                </div>
              </div>
            </div>

            {/* Mô tả trang */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả trang (Meta description)
              </label>
              <textarea
                rows={3}
                defaultValue="Một cộng đồng chuyên nghiệp dành cho các nhà phát triển và những người đam mê công nghệ để chia sẻ kiến thức và thảo luận về các xu hướng mới nhất trong ngành."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px] resize-none"
              />
            </div>
          </div>

          {/* Chế độ bảo trì Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
              <span className="text-blue-500 bg-blue-50 p-1.5 rounded-md">
                <Wrench className="w-5 h-5" />
              </span>
              Chế độ bảo trì
            </h2>

            <div className={`p-5 rounded-xl border transition-colors ${maintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-[#FFFDF4] border-[#FDE68A] object-contain'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-[15px]">
                    Kích hoạt Chế độ Bảo trì
                  </h3>
                  <p className="text-sm text-amber-700/80">
                    Khi được bật, người dùng thông thường sẽ không thể truy cập website. Chỉ quản trị viên mới có thể đăng nhập để thực hiện nâng cấp hoặc bảo trì hệ thống.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <div className="ml-4 pt-1">
                  <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${maintenanceMode ? 'bg-blue-600' : 'bg-gray-300'}
                    `}
                  >
                    <span 
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out
                        ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100">
            <button className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Hủy Thay đổi
            </button>
            <button className="px-6 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
              Lưu Thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
