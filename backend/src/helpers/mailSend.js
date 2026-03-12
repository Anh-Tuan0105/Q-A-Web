import axios from "axios";

export const sendMail = async (to, subject, html) => {
    await axios.post(
        process.env.GOOGLE_SCRIPT_URL,
        {
            to,
            subject,
            html,
        }
    );
};
