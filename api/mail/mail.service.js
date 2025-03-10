import nodemailer from "nodemailer";
import User from "./mail.model.js";

export const registerUserService = async (gmail, password) => {
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
        return { error: "Email already registered" };
    }

    const newUser = new User({ gmail, password });
    await newUser.save();
    return { message: "User registered successfully" };
};

export const sendMailService = async (appID, to, subject, content) => {
    const user = await User.findOne({ apiKey: appID });
    if (!user) {
        return { error: "Invalid API Key" };
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user.gmail,
            pass: user.password
        }
    });

    await transporter.sendMail({ from: user.gmail, to, subject, text: content });
    return { message: "Email sent successfully!" };
};
