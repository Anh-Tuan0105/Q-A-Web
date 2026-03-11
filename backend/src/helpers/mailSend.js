import axios from "axios";

export const sendMail = async (to, subject, html) => {
    await axios.post(
        "https://script.google.com/macros/s/AKfycbwoAnUvgfWSyP3KAhzZLgXQ-4tQskFJFX-SntpUqmT6ZSdzRuMVMuULLiFsYd1K1Pu-/exec",
        {
            to,
            subject,
            html,
        }
    );
};
