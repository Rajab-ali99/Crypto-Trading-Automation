
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

export async function sendMail(receiver, subject, text) {
    try {
        const options = {
            from: `'Bulish Pixel' <${process.env.NODEMAILER_EMAIL}>`,
            to: receiver,
            subject: subject,
            html: text
        }
        await transporter.sendMail(options);
        return { success: true, message: "Email sent successfully." }
    } catch (error) {
        return { success: false, message: error.message }
    }
}


