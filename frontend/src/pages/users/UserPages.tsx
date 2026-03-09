import { toast } from "sonner";
import LogoutButton from "../../components/ui/LogoutButton";
import api from "../../lib/axios";
import { useAuthStore } from "../../stores/useAuthStore";
import Header from "../../components/header/Header";
import Sider from "../../components/sider/Sider";
import { useNavigate } from "react-router";

const UserPages = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleOnClick = async () => {
    if (!user) {
      toast.info("Bạn cần đăng nhập để thực hiện tính năng này");
      navigate("/signin");
      return;
    }

    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("oke");
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
        {/* Sider Area: 32px left padding (pl-8) is inside Sider to match the image req */}
        <Sider />

        {/* Main Content Area: gap is 32px (ml-8) from the sider */}
        <main className="flex-1 ml-8 pr-8 pb-12 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Trang chủ Q&A (Public Route)
            </h1>
            {user && <LogoutButton />}
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            {user ? (
              <p className="text-slate-600 mb-4">
                Chào mừng{" "}
                <span className="font-semibold text-slate-900">
                  {user.displayName}
                </span>{" "}
                quay trở lại!
              </p>
            ) : (
              <p className="text-slate-600 mb-4">
                Chào mừng khách truy cập! Nơi chia sẻ kiến thức cộng đồng.
              </p>
            )}
            <button
              onClick={handleOnClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Thực hiện kiểm tra (Test API)
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPages;
