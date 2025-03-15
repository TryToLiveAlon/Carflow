import nodemailer from "nodemailer";
import express from "express";

const router = express.Router();

const mailHandler = async (req, res) => {
    try {
        const { gmail, password, to, subject, content, isHtml, attachmentUrl } = req.body;

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

        // ✅ Prepare email options
        const mailOptions = {
            from: gmail,
            to,
            subject,
            [isHtml === "true" ? "html" : "text"]: content,
            attachments: attachmentUrl
                ? [{ filename: attachmentUrl.split("/").pop(), path: attachmentUrl }]
                : []
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

// ✅ Allow only POST requests
router.post("/", mailHandler);

// ❌ Return "Method Not Allowed" for GET requests
router.get("/", (req, res) => {
    res.status(405).json({ error: "Method Not Allowed. Use POST instead." });
});

export default router;
