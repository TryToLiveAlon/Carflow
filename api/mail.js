import nodemailer from "nodemailer";

const mailHandler = async ({ from, password, to, subject, content, isHtml, attachmentUrl }) => {
    try {
        if (!from || !password || !to || !subject || !content) {
            return { error: "Missing required parameters" };
        }

        // Configure mail transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // Use 587 if 465 doesn’t work
            secure: true, // true for port 465, false for 587
            auth: {
                user: from,
                pass: password, // Use an App Password instead of your real password
            },
            connectionTimeout: 10000, // Set a timeout of 10 seconds
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
