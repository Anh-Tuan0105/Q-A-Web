import Setting from "../models/Setting.js";

export const maintenanceMiddleware = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        // Luôn cho phép các request đến auth/admin/login hoặc chính settings để tránh deadlock
        // Kiểm tra bao gồm cả có /api hoặc không
        const isExcluded = req.path.includes("/admin/login") || 
                          req.path.includes("/settings") || 
                          req.path.includes("/auth/refresh");

        if (isExcluded) {
            return next();
        }

        const settings = await Setting.findOne();
        
        if (settings?.maintenanceMode) {
            // Nếu có user đã đăng nhập, kiểm tra xem có phải admin không
            // req.user sẽ có được từ middleware protectedRoute hoặc optionalAuth gọi trước đó
            if (req.user && req.user.role === 'admin') {
                return next();
            }

            return res.status(503).json({ 
                message: "Hệ thống đang bảo trì", 
                maintenance: true 
            });
        }

        next();
    } catch (error) {
        console.error("Lỗi maintenanceMiddleware:", error);
        next();
    }
};
