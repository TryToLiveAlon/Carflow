import express from "express";
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import brainHandler from "./api/brain.js";
import sendEmail from "./api/mail.js";
import lyricsHandler from "./api/lyrics.js";
import deepSeek from "./api/deepseek.js";
import mistral from "./api/mistral.js";
import mailHandler from "./api/anonymous-mail.js";

const app = express();
app.use(express.json());

// 🏠 Root Route
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ TeleAPI: "Hi, I guess I am Live" });
});

// 📚 API Routes
app.get("/api/lyrics", lyricsHandler);
app.use("/api/movie", movieHandler);
app.use("/api/vehicle", vehicleHandler);
app.use("/api/brain", brainHandler);
app.use("/api/deepseek", deepSeek);
app.use("/api/mistral", mistral);
app.use("/api/mail-id", mailHandler);
app.post("/api/mail", sendEmail);

// 🚫 404 Route Handling
app.use((req, res) => {
    res.status(404).json({ error: "404: NOT FOUND" });
});

// 🚀 Start the Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
