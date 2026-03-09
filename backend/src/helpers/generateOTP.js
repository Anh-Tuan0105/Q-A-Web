export const generateOTP = () => {
    // Tạo mã OTP 6 số ngẫu nhiên từ 100000 đến 999999
    return Math.floor(100000 + Math.random() * 900000).toString();
};
