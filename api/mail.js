import nodemailer from "nodemailer";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { gmail, password, to, subject, content, isHtml, attachmentUrl } = req.body;

        // ✅ Validate required fields
        if (!gmail || !password || !to || !subject || !content) {
            return res.status(400).json({
                error: "Missing required parameters",
                note: "Use an App Password instead of your actual Gmail password",
                provider: "https://t.me/TryToLiveAlon",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
            });
        }

        // ✅ Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmail, pass: password }
        });

        // ✅ Prepare email options
        const mailOptions = {
            from: gmail,
            to,
            subject,
            [isHtml === "true" ? "html" : "text"]: content, // Supports HTML or plain text
            attachments: attachmentUrl
                ? [{ filename: attachmentUrl.split("/").pop(), path: attachmentUrl }]
                : [] // ✅ If no attachment URL, attachments remain empty
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

        let errorMessage = "Failed to send email";
        if (error.response) {
            errorMessage = error.response;
        } else if (error.code === "EAUTH") {
            errorMessage = "Invalid Gmail or password. Use an App Password.";
        } else if (error.code === "ENOTFOUND") {
            errorMessage = "Gmail service unavailable. Try again later.";
        }

        res.status(500).json({
            error: errorMessage,
            provider: "https://t.me/TryToLiveAlon",
            documentation: "https://death-docs.vercel.app/API/Quick%20Start"
        });
    }
});

export default router;
            
