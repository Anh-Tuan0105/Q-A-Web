import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Lỗi: Thiếu biến môi trường EMAIL_USER hoặc EMAIL_PASS");
        throw new Error("Cấu hình Email không tồn tại trên Server");
    }

    console.log(`Đang khởi tạo Nodemailer để gửi tới: ${to}...`);

    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Configure the mailoptions object
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: text,
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });

}
