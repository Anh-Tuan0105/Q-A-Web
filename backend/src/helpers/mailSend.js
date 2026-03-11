import nodemailer from 'nodemailer'

export const sendMail = async (to, subject, text) => {
    // Kiểm tra biến môi trường
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Lỗi: Thiếu biến môi trường EMAIL_USER hoặc EMAIL_PASS");
        throw new Error("Cấu hình Email không tồn tại trên Server");
    }

    // Cấu hình linh hoạt hơn: Thử dùng Port 587 (STARTTLS) thay vì 465 nếu bị chặn
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // Chuyển từ 465 sang 587
        secure: false, // Chuyển thành false để dùng STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // Quan trọng cho môi trường Cloud
            rejectUnauthorized: false,
            minVersion: "TLSv1.2"
        },
        pool: true // Sử dụng connection pool để giữ kết nối ổn định
    });

    // 1. Kiểm tra kết nối trước khi gửi (Thêm timeout 10s tránh treo)
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Nodemailer verify timeout (10s)"));
        }, 10000);

        transporter.verify(function (error, success) {
            clearTimeout(timer);
            if (error) {
                console.error("Nodemailer verify error:", error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const mailData = {
        from: {
            name: "Q&A Web",
            address: process.env.EMAIL_USER,
        },
        to: to,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`,
    };

    // 2. Gửi mail và đợi kết quả (Thêm timeout 20s)
    return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Nodemailer sendMail timeout (20s)"));
        }, 20000);

        transporter.sendMail(mailData, (err, info) => {
            clearTimeout(timer);
            if (err) {
                console.error("Nodemailer send error:", err);
                reject(err);
            } else {
                console.log("Email sent successfully:", info.response);
                resolve(info);
            }
        });
    });
}
