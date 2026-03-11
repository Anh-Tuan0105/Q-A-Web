import axios from 'axios';

export const sendMail = async (to, subject, text) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.BREVO_SENDER_EMAIL || "huynhngocanhtuan9a9@gmail.com";

        if (!apiKey) {
            console.error("Lỗi: Thiếu biến môi trường BREVO_API_KEY");
            throw new Error("Cấu hình Brevo không tồn tại trên Server");
        }

        console.log(`Đang gửi mail tới: ${to} qua Brevo API...`);

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: "Q&A Web", email: senderEmail },
                to: [{ email: to }],
                subject: subject,
                htmlContent: `<p>${text}</p>`,
                textContent: text
            },
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        console.log('Email sent successfully via Brevo:', response.data.messageId);
        return response.data;

    } catch (error) {
        console.error('Lỗi gửi mail qua Brevo:', error.response?.data || error.message);
        throw error;
    }
}
