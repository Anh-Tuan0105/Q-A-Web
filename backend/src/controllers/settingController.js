import Setting from "../models/Setting.js";

export const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Lỗi getSettings:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi lấy cấu hình" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { siteName, systemEmail, metaDescription, maintenanceMode, logoUrl, faviconUrl } = req.body;
        
        let settings = await Setting.findOne();
        if (!settings) {
            settings = new Setting();
        }

        if (siteName !== undefined) settings.siteName = siteName;
        if (systemEmail !== undefined) settings.systemEmail = systemEmail;
        if (metaDescription !== undefined) settings.metaDescription = metaDescription;
        if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
        if (logoUrl !== undefined) settings.logoUrl = logoUrl;
        if (faviconUrl !== undefined) settings.faviconUrl = faviconUrl;

        await settings.save();
        res.status(200).json(settings);
    } catch (error) {
        console.error("Lỗi updateSettings:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi cập nhật cấu hình" });
    }
};
