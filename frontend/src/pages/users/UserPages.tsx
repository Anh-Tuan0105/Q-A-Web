import { toast } from "sonner";
import LogoutButton from "../../components/ui/LogoutButton";
import api from "../../lib/axios";
import { useAuthStore } from "../../stores/useAuthStore";

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
    <>
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
    </>
  );
};

export default UserPages;
