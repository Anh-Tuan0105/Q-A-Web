import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutTemplate, Wrench, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  DEFAULT_ADMIN_SETTINGS,
  type AdminSettingsData,
  useAdminSettingsStore,
} from '../../stores/useAdminSettingsStore';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Không thể đọc tệp đã chọn'));
    reader.readAsDataURL(file);
  });

const AdminSettings = () => {
  const siteName = useAdminSettingsStore((state) => state.siteName);
  const systemEmail = useAdminSettingsStore((state) => state.systemEmail);
  const metaDescription = useAdminSettingsStore((state) => state.metaDescription);
  const maintenanceMode = useAdminSettingsStore((state) => state.maintenanceMode);
  const logoUrl = useAdminSettingsStore((state) => state.logoUrl);
  const faviconUrl = useAdminSettingsStore((state) => state.faviconUrl);
  const resetSettings = useAdminSettingsStore((state) => state.resetSettings);
  const fetchSettings = useAdminSettingsStore((state) => state.fetchSettings);
  const updateSettingsOnServer = useAdminSettingsStore((state) => state.updateSettingsOnServer);

  const savedSettings = useMemo(
    () => ({
      siteName,
      systemEmail,
      metaDescription,
      maintenanceMode,
      logoUrl,
      faviconUrl,
    }),
    [siteName, systemEmail, metaDescription, maintenanceMode, logoUrl, faviconUrl]
  );

  const [formData, setFormData] = useState<AdminSettingsData>(savedSettings);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setFormData(savedSettings);
  }, [savedSettings]);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedSettings);

  const handleChange = (field: keyof AdminSettingsData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'faviconUrl'
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Định dạng ảnh không hợp lệ');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Kích thước ảnh vượt quá 2MB');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, [field]: dataUrl }));
    } catch (error) {
      console.log(error);
      toast.error('Không thể đọc ảnh đã chọn');
    }
  };

  const handleCancel = () => {
    setFormData(savedSettings);
    toast.info('Đã hoàn tác các thay đổi chưa lưu');
  };

  const handleReset = () => {
    resetSettings();
    setFormData(DEFAULT_ADMIN_SETTINGS);
    toast.success('Đã khôi phục cấu hình mặc định');
  };

  const handleSave = async () => {
    if (!formData.siteName.trim()) {
      toast.error('Tên website không được để trống');
      return;
    }

    if (!formData.systemEmail.trim()) {
      toast.error('Email hệ thống không được để trống');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.systemEmail)) {
      toast.error('Email hệ thống không hợp lệ');
      return;
    }

    if (!formData.metaDescription.trim()) {
      toast.error('Mô tả trang không được để trống');
      return;
    }

    try {
      setIsSaving(true);
      await updateSettingsOnServer(formData);
      toast.success('Đã lưu cài đặt hệ thống lên máy chủ');
    } catch (error) {
      console.log(error)
      toast.error('Không thể lưu cài đặt. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

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
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
              <span className="text-blue-500 bg-blue-50 p-1.5 rounded-md">
                <LayoutTemplate className="w-5 h-5" />
              </span>
              Nhận diện thương hiệu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Website
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Hệ thống
                </label>
                <input
                  type="email"
                  value={formData.systemEmail}
                  onChange={(e) => handleChange('systemEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tải lên Logo
                </label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e, 'logoUrl')}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Chọn tệp
                  </button>
                  <span className="text-xs text-gray-400">Tối đa 2MB. SVG, PNG hoặc JPG.</span>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <img src={formData.logoUrl} alt="Logo preview" className="w-10 h-10 rounded object-cover bg-white border border-slate-200" />
                  <span className="text-sm text-slate-500">Logo hiện tại</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tải lên Favicon
                </label>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept=".ico,.png,.svg"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e, 'faviconUrl')}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    className="px-4 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Chọn tệp
                  </button>
                  <span className="text-xs text-gray-400">Định dạng .ico, .svg hoặc .png.</span>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <img src={formData.faviconUrl} alt="Favicon preview" className="w-10 h-10 rounded object-cover bg-white border border-slate-200" />
                  <span className="text-sm text-slate-500">Favicon hiện tại</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả trang (Meta description)
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px] resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
              <span className="text-blue-500 bg-blue-50 p-1.5 rounded-md">
                <Wrench className="w-5 h-5" />
              </span>
              Chế độ bảo trì
            </h2>

            <div className={`p-5 rounded-xl border transition-colors ${formData.maintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-[#FFFDF4] border-[#FDE68A]'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-[15px]">
                    Kích hoạt Chế độ Bảo trì
                  </h3>
                  <p className="text-sm text-amber-700/80">
                    Khi được bật, người dùng thông thường sẽ không thể truy cập website. Chỉ quản trị viên mới có thể đăng nhập để thực hiện nâng cấp hoặc bảo trì hệ thống.
                  </p>
                </div>

                <div className="ml-4 pt-1">
                  <button
                    type="button"
                    onClick={() => handleChange('maintenanceMode', !formData.maintenanceMode)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${formData.maintenanceMode ? 'bg-blue-600' : 'bg-gray-300'}
                    `}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                        transition duration-200 ease-in-out
                        ${formData.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Khôi phục mặc định
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={!isDirty || isSaving}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy Thay đổi
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="px-6 py-2.5 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
