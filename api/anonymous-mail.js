import axios from "axios";
import express from "express";

const router = express.Router();

// Handle both GET and POST requests
const sendAnonymousEmail = async (req, res) => {
    const { message, subject, receiver } = req.method === "GET" ? req.query : req.body;

    if (!message || !subject || !receiver) {
        return res.status(400).json({ error: "All fields (message, subject, receiver) are required." });
    }

    try {
        const response = await axios.post(
            "https://api.proxynova.com/v1/send_email",
            `to=${encodeURIComponent(receiver)}&from=Anonymous&subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`,
            {
                headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Accept": "*/*",
                    "Origin": "https://www.proxynova.com",
                    "Sec-Fetch-Site": "same-site",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Dest": "empty",
                    "Referer": "https://www.proxynova.com/",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Priority": "u=1, i"
                }
            }
        );

        res.json({ success: "Email sent successfully!", response: response.data });
    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ error: "Failed to send email.", details: error.message });
    }
};

// Attach both GET and POST route

export default router;
              
