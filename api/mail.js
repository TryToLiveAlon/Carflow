import nodemailer from "nodemailer";

const mailHandler = async (req, res) => {
    try {
        const { gmail, password, to, subject, content } = req.query;

        if (!gmail || !password || !to || !subject || !content) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // ✅ Create Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmail, pass: password }
        });

        // ✅ Send Email
        await transporter.sendMail({ from: gmail, to, subject, text: content });

        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

export default mailHandler;
