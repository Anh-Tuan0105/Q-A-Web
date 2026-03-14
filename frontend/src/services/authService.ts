import api from "../lib/axios"

export const authService = {
    signup: async (
        username: string,
        password: string,
        email: string,
        firstname: string,
        lastname: string
    ) => {
        const res = await api.post("/auth/signup", {
            username,
            password,
            email,
            firstname,
            lastname
        }, { withCredentials: true });
        return res.data;
    },
    signin: async (username: string, password: string) => {
        const res = await api.post("/auth/signin", {
            username,
            password
        }, { withCredentials: true });
        return res.data;
    },
    logout: async () => {
        const res = await api.post("/auth/logout", { withCredentials: true });
        return res.data;
    },

    fetchMe: async () => {
        const res = await api.get("/users/me", { withCredentials: true });
        return res.data;
    },

    refresh: async () => {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        return res.data;
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const res = await api.post("/auth/change-password", { currentPassword, newPassword }, { withCredentials: true });
        return res.data;
    },

    requestEmailChange: async (newEmail: string) => {
        const res = await api.post("/auth/request-email-change", { newEmail }, { withCredentials: true });
        return res.data;
    },

    verifyEmailChange: async (newEmail: string, otp: string) => {
        const res = await api.post("/auth/verify-email-change", { newEmail, otp }, { withCredentials: true });
        return res.data;
    },
    updateProfile: async (data: any) => {
        const res = await api.put("/users/profile", data, { withCredentials: true });
        return res.data;
    },
    adminLogin: async (username: string, password: string) => {
        const res = await api.post("/auth/admin/login", {
            username,
            password
        }, { withCredentials: true });
        return res.data;
    }
}
