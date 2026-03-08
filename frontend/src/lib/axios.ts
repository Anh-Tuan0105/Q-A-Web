import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'



const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5000/api" : "/api",
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            // console.log("refresh", originalRequest._retryCount);

            try {
                const res = await api.post("/auth/refresh", { withCrendentials: true });
                const newAccessToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearState();
                return Promise.reject(refreshError); 
            }
        }

        return Promise.reject(error);
    }
)

export default api
