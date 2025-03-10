import { registerUserService, sendMailService } from "./mail.service.js";

export const registerUser = async (req, res) => {
    try {
        const { gmail, password } = req.query;
        if (!gmail || !password) {
            return res.status(400).json({ error: "Missing gmail or password" });
        }

        const response = await registerUserService(gmail, password);
        return res.json(response);
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendMail = async (req, res) => {
    try {
        const { appID, to, subject, content } = req.body;
        if (!appID || !to || !subject || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await sendMailService(appID, to, subject, content);
        return res.json(response);
    } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ error: "Failed to send email" });
    }
};
