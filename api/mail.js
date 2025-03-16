import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed. Use GET instead." });
    }

    const { from, password, to, subject, content, isHtml, attachmentUrl } = req.query;

    if (!from || !password || !to || !subject || !content) {
        return res.status(400).json({ error: "Missing required parameters",
                                    IMPORTANT: {
                provider: "https://t.me/TryToLiveAlone",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                                    }});
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // Try 465 if 587 doesn’t work
            secure: false, // Use `true` for port 465
            auth: {
                user: from,
                pass: password, // Use an App Password instead of real password
            },
            connectionTimeout: 10000, // Set timeout to 10s
        });

        const mailOptions = {
            from,
            to,
            subject,
            [isHtml === "true" ? "html" : "text"]: content,
            attachments: attachmentUrl
                ? [{ filename: "attachment.jpg", path: attachmentUrl }]
                : [],
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: "Email sent successfully!",
                                    IMPORTANT: {
                provider: "https://t.me/TryToLiveAlone",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                                    }});

    } catch (error) {
        return res.status(500).json({ error: "Failed to send email",
                                     IMPORTANT: {
                provider: "https://t.me/TryToLiveAlone",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                                     }, details: error.message });
    }
                }
    
