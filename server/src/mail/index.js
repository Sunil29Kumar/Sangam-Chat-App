
import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ from, to, subject, html }) => {
    try {

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html
        });

        if (error) {
            return console.error({ error });
        }

    } catch (err) {
        console.error("Mail error:", err.message);
    }
};



