import nodemailer from 'nodemailer'

export const sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, //587
        secure: true, //false
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };


    try {
        // Sử dụng await mà không có callback để Vercel đợi kết quả
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Lỗi Nodemailer:', error);
        throw error; // Đẩy lỗi ra ngoài để API trả về status 500
    }
}
