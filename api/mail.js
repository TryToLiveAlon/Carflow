import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// ✅ Email Sending Logic
const mailHandler = async (req, res) => {
    console.log("Received request body:", req.body); // Debug log

    try {
        const { gmail, password, to, subject, content, isHtml, attachmentUrl } = req.body;

        // ✅ Validate Required Parameters
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

        // ✅ Construct Email Options
        const mailOptions = {
            from: gmail,
            to,
            subject,
            [isHtml ? "html" : "text"]: content, // Sends HTML or plain text
            attachments: attachmentUrl
                ? [{ filename: attachmentUrl.split("/").pop(), path: attachmentUrl }]
                : [] // Attachments (optional)
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

// ✅ Only allow POST requests
router.post("/", mailHandler);
router.all("/", (req, res) => res.status(405).json({ error: "Method Not Allowed" }));

export default router;  // ✅ Corrected export
