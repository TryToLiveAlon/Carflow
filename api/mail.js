import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import crypto from "crypto";
import cron from "node-cron";

const router = express.Router();

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://RB14goCNTApsB54I:RB14goCNTApsB54I@cluster0.8qjbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ✅ Define User Schema
const UserSchema = new mongoose.Schema({
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true },
    lastUsed: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// ✅ 1. Register API with Login Verification
router.get("/register", async (req, res) => {
    try {
        const { gmail, password } = req.query;
        if (!gmail || !password) {
            return res.status(400).json({ error: "Missing gmail or password" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ gmail });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Generate a unique API key
        const apiKey = crypto.randomBytes(16).toString("hex");

        // Nodemailer transporter for self-verification
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmail,
                pass: password
            }
        });

        // Verification email to itself
        const mailOptions = {
            from: gmail,
            to: gmail,
            subject: "Login Verification",
            text: "This is an automatic email to verify that your account is successfully connected."
        };

        // Try sending email to itself
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            return res.status(403).json({ error: "Invalid Gmail or Password. Login failed." });
        }

        // Save user to database if email sent successfully
        const newUser = new User({ gmail, password, apiKey });
        await newUser.save();

        res.json({ message: "User registered successfully", apiKey });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ 2. Send Mail API
router.post("/", async (req, res) => {
    try {
        const { appID, to, subject, content } = req.body;
        if (!appID || !to || !subject || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find user by API key
        const user = await User.findOne({ apiKey: appID });
        if (!user) {
            return res.status(403).json({ error: "Invalid API Key" });
        }

        // Update lastUsed timestamp
        user.lastUsed = new Date();
        await user.save();

        // Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: user.gmail,
                pass: user.password
            }
        });

        // Email details
        const mailOptions = {
            from: user.gmail,
            to,
            subject,
            text: content
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// ✅ 3. Auto-Remove Inactive Users
cron.schedule("0 0 * * *", async () => {
    try {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        // Delete users inactive for 2 months
        const deletedUsers = await User.deleteMany({ lastUsed: { $lt: twoMonthsAgo } });
        console.log(`✅ Removed ${deletedUsers.deletedCount} inactive users`);
    } catch (error) {
        console.error("❌ Error in deleting inactive users:", error);
    }
});

export default router;
  
