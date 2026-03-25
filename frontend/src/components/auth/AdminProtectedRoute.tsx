import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";

const AdminProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        try {
            if (!accessToken) {
                await refresh();
            }
            const currentToken = useAuthStore.getState().accessToken;
            if (currentToken && !useAuthStore.getState().user) {
                await fetchMe();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setStarting(false);
        }
    }

    useEffect(() => {
        init();
    }, [])

    if (starting || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading message="Đang tải trang..." />
            </div>
        );
    }

    // Chưa đăng nhập → về trang admin login
    if (!accessToken) {
        return <Navigate to="/admin/login" replace />
    }

    // Đã đăng nhập nhưng không phải admin → về trang admin login
    if (user?.role !== 'admin') {
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />
}

export default AdminProtectedRoute
