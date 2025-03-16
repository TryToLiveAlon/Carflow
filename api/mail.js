import nodemailer from "nodemailer";

const mailHandler = async ({ from, password, to, subject, content, isHtml, attachmentUrl }) => {
    try {
        if (!from || !password || !to || !subject || !content) {
            return { error: "Missing required parameters" };
        }

        // Configure mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: from,
                pass: password,
            },
        });

        // Email options
        const mailOptions = {
            from,
            to,
            subject,
            [isHtml === "true" ? "html" : "text"]: content,
            attachments: attachmentUrl ? [{ filename: "attachment.jpg", path: attachmentUrl }] : [],
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return { success: "Email sent successfully!" };

    } catch (error) {
        return { error: "Failed to send email", details: error.message };
    }
};

export default mailHandler;
