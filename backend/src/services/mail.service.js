import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(receiver, subject, text) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: receiver,
            subject,
            html: text,
        });

        if (error) {
            console.error("Resend error:", error);

            return {
                success: false,
                message: error.message || "Failed to send email.",
            };
        }

        console.log("Email sent successfully:", data);

        return {
            success: true,
            message: "Email sent successfully.",
        };

    } catch (error) {
        console.error("Resend error:", error);

        return {
            success: false,
            message: error.message || "Failed to send email.",
        };
    }
}


