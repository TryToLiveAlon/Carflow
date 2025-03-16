import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { from, password, to, subject, content, isHtml, attachmentUrl } = req.body;
        
        if (!from || !password || !to || !subject || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: from, pass: password }
        });

        let mailOptions = {
            from,
            to,
            subject,
            [isHtml ? "html" : "text"]: content,
            attachments: attachmentUrl ? [{ filename: "attachment.jpg", path: attachmentUrl }] : []
        };

        let info = await transporter.sendMail(mailOptions);
        res.json({ success: true, messageId: info.messageId });

    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

export default router;
