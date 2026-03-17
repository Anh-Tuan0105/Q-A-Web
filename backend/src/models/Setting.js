import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "DevCommunity",
  },
  systemEmail: {
    type: String,
    default: "admin@community.io",
  },
  metaDescription: {
    type: String,
    default: "Cộng đồng lập trình viên Việt Nam.",
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  logoUrl: {
    type: String,
    default: "/logo.svg",
  },
  faviconUrl: {
    type: String,
    default: "/logo.svg",
  },
}, { timestamps: true });

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
