import { create } from "zustand";
import { toast } from "sonner"
import { authService } from "../services/authService";
import type { AuthState } from "../types/store";


export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,


    setAccessToken: (accessToken) => {
        set({ accessToken });
    },

    clearState: () => {
        set({ user: null, accessToken: null, loading: false });
    },

    signup: async (username, password, email, firstname, lastname) => {
        try {
            set({ loading: true });
            await authService.signup(username, password, email, firstname, lastname);
            toast.success("Đăng ký thành công")
        } catch (error) {
            console.log(error);
            toast.error("Đăng ký thất bại")
        } finally {
            set({ loading: false });
        }
    },

    signin: async (username, password) => {
        try {
            set({ loading: true });
            const res = await authService.signin(username, password);
            get().setAccessToken(res.accessToken);
            await get().fetchMe();
            toast.success("Đăng nhập thành công");
        } catch (error) {
            console.log(error);
            toast.error("Đăng nhập thất bại");
        } finally {
            set({ loading: false })
        }
    },

    logout: async () => {
        try {
            get().clearState();
            await authService.logout();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.log(error);
            toast.error("Đăng xuất thất bại");
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user: user });

        } catch (error) {
            console.log(error);
            set({ user: null, accessToken: null });
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại");
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();
            const data = await authService.refresh();
            setAccessToken(data.accessToken);
            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.log(error);
            // Không hiển thị toast lỗi ở đây vì khách chưa đăng nhập cũng sẽ gọi hàm này
            get().clearState();
        } finally {
            set({ loading: false });
        }
    }
}));

