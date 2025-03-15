import nodemailer from "nodemailer";
import express from "express";

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

        // ✅ Email Options
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

export default mailHandler;
