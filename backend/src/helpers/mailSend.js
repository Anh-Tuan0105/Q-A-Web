import nodemailer from 'nodemailer'

export const sendMail = async (to, subject, text) => {
    // Cấu hình tối ưu cho việc deploy lên Internet (Render, Vercel, ...)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Đảm bảo đây là Mật khẩu ứng dụng (App Password)
        },
        tls: {
            // Không từ chối các chứng chỉ không được ủy quyền (fix lỗi chứng chỉ khi deploy)
            rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: `"Q&A Web" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text
    };

    try {
        console.log(`Đang gửi mail tới: ${to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: ' + info.response);
        return info;
    } catch (error) {
        console.error('Lỗi Nodemailer chi tiết:', error);
        throw error;
    }
}
