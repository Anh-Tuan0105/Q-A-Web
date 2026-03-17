import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export interface AdminSettingsData {
  siteName: string;
  systemEmail: string;
  metaDescription: string;
  maintenanceMode: boolean;
  logoUrl: string;
  faviconUrl: string;
}

interface AdminSettingsState extends AdminSettingsData {
  setSettings: (settings: Partial<AdminSettingsData>) => void;
  resetSettings: () => void;
  applySettings: () => void;
  fetchSettings: () => Promise<void>;
  updateSettingsOnServer: (settings: AdminSettingsData) => Promise<void>;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettingsData = {
  siteName: "DevCommunity",
  systemEmail: "admin@community.io",
  metaDescription:
    "Một cộng đồng chuyên nghiệp dành cho các nhà phát triển và những người đam mê công nghệ để chia sẻ kiến thức và thảo luận về các xu hướng mới nhất trong ngành.",
  maintenanceMode: false,
  logoUrl: "/logo.svg",
  faviconUrl: "/logo.svg",
};

const ensureMetaDescription = () => {
  if (typeof document === "undefined") return null;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  return meta;
};

const ensureFavicon = () => {
  if (typeof document === "undefined") return null;
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.setAttribute("rel", "icon");
    document.head.appendChild(favicon);
  }
  return favicon;
};

export const applyAdminSettingsToDocument = (settings: AdminSettingsData) => {
  if (typeof document === "undefined") return;

  document.title = settings.siteName || DEFAULT_ADMIN_SETTINGS.siteName;
  const meta = ensureMetaDescription();
  if (meta) {
    meta.setAttribute("content", settings.metaDescription || DEFAULT_ADMIN_SETTINGS.metaDescription);
  }
  const favicon = ensureFavicon();
  if (favicon) {
    favicon.setAttribute("href", settings.faviconUrl || DEFAULT_ADMIN_SETTINGS.faviconUrl);
  }
};

export const useAdminSettingsStore = create<AdminSettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_ADMIN_SETTINGS,
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetSettings: () => {
        set(DEFAULT_ADMIN_SETTINGS);
        applyAdminSettingsToDocument(DEFAULT_ADMIN_SETTINGS);
      },
      fetchSettings: async () => {
          try {
              const res = await api.get("/settings");
              set(res.data);
              applyAdminSettingsToDocument(res.data);
          } catch (error) {
              console.error("Lỗi khi tải cấu hình:", error);
          }
      },
      updateSettingsOnServer: async (formData) => {
          try {
              const res = await api.put("/settings", formData);
              set(res.data);
              applyAdminSettingsToDocument(res.data);
          } catch (error) {
              console.error("Lỗi khi cập nhật cấu hình:", error);
              throw error;
          }
      },
      applySettings: () => {
        const settings = get();
        applyAdminSettingsToDocument(settings);
      },
    }),
    {
      name: "admin-settings-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyAdminSettingsToDocument(state);
        }
      },
    }
  )
);
