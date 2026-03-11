import { Resend } from 'resend';

// Khởi tạo Resend với API Key từ biến môi trường
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to, subject, text) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error("Lỗi: Thiếu biến môi trường RESEND_API_KEY");
            throw new Error("Cấu hình Resend không tồn tại trên Server");
        }

        console.log(`Đang gửi mail tới: ${to} qua Resend API...`);

        const { data, error } = await resend.emails.send({
            from: 'Q&A Web <onboarding@resend.dev>', // Email mặc định của Resend khi chưa verify domain
            to: [to],
            subject: subject,
            text: text,
            html: `<p>${text}</p>`,
        });

        if (error) {
            console.error("Lỗi Resend API:", error);
            throw error;
        }

        console.log('Email sent successfully via Resend:', data.id);
        return data;

    } catch (error) {
        console.error('Lỗi gửi mail qua Resend:', error);
        throw error;
    }
}
