import { create } from "zustand";
import { toast } from "sonner"
import { authService } from "../services/authService";
import type { AuthState } from "../types/store";
import { persist } from "zustand/middleware";


export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        user: null,
        loading: false,


        setAccessToken: (accessToken) => {
            set({ accessToken });
        },

        clearState: () => {
            set({ user: null, accessToken: null, loading: false });
            localStorage.removeItem('auth-storage');
        },

        signup: async (username, password, email, firstname, lastname) => {
            try {
                set({ loading: true });
                await authService.signup(username, password, email, firstname, lastname);
                toast.success("Đăng ký thành công")
                return true;
            } catch (error: any) {
                console.log(error);
                const message = error.response?.data?.message || "Đăng ký thất bại";
                toast.error(message);
                return false;
            } finally {
                set({ loading: false });
            }
        },

        signin: async (username, password) => {
            try {
                set({ loading: true });
                localStorage.removeItem('auth-storage');
                const res = await authService.signin(username, password);
                get().setAccessToken(res.accessToken);
                await get().fetchMe();
                toast.success("Đăng nhập thành công");
                return true;
            } catch (error: any) {
                console.log(error);
                if (error.response?.status === 503) {
                    toast.error("Hệ thống đang bảo trì. Vui lòng quay lại sau.");
                } else {
                    toast.error("Đăng nhập thất bại. Tài khoản hoặc mật khẩu không chính xác.");
                }
                return false;
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
                get().clearState();
            } finally {
                set({ loading: false });
            }
        },

        requestEmailChange: async (newEmail: string) => {
            try {
                set({ loading: true });
                const res = await authService.requestEmailChange(newEmail);
                return res;
            } catch (error: any) {
                console.error(error);
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        verifyEmailChange: async (newEmail: string, otp: string) => {
            try {
                set({ loading: true });
                const res = await authService.verifyEmailChange(newEmail, otp);
                return res;
            } catch (error: any) {
                console.error(error);
                throw error;
            }
        },
        updateProfile: async (data) => {
            try {
                set({ loading: true });
                const updatedUser = await authService.updateProfile(data);
                set({ user: updatedUser });
                toast.success("Cập nhật thông tin thành công");
                return true;
            } catch (error: any) {
                console.log(error);
                toast.error(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
                return false;
            } finally {
                set({ loading: false });
            }
        }
    }), {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }),
    })
);
