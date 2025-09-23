import nodemailer from "nodemailer";

export async function sendEmail(message) {
    if (!message) return false;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "abhisarverma163@gmail.com",
            subject: "Typesmart Website User Review",
            text: message,
        });

        return true;
    } catch (err) {
        console.error("Error sending email:", err);
        return false;
    }
}
