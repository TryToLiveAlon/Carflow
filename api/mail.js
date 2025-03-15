import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const mailHandler = async (req, res) => {
    try {
        const { gmail, password, to, subject, content, isHtml, attachment } = req.body;

        if (!gmail || !password || !to || !subject || !content) {
            return res.status(400).json({
                error: "Missing required parameters",
                provider: "https://t.me/TryToLiveAlon",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
            });
        }

        // ✅ Create Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmail, pass: password }
        });

        // ✅ Set email format (HTML or Plain Text)
        const mailOptions = {
            from: gmail,
            to,
            subject,
            [isHtml ? "html" : "text"]: content, // If isHtml is true, send as HTML, else text
            attachments: attachment ? [{ filename: "attachment", path: attachment }] : []
        };

        // ✅ Send Email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Email sent successfully!",
            provider: "https://t.me/TryToLiveAlon",
            documentation: "https://death-docs.vercel.app/API/Quick%20Start"
        });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({
            error: "Failed to send email",
            provider: "https://t.me/TryToLiveAlon",
            documentation: "https://death-docs.vercel.app/API/Quick%20Start"
        });
    }
};

// ✅ Use only POST, reject GET
router.post("/", mailHandler);
router.all("/", (req, res) => res.status(405).json({ error: "Method Not Allowed" }));

export default router;
                
