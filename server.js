import express from "express";
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import gptHandler from "./api/gpt.js";
import sendEmail from "./api/mail.js";
import lyricsHandler from "./api/lyrics.js";
import gptHandler4 from "./api/gpt4.js";
import deepSeek from "./api/deepseek.js";
import Mistral from "./api/mistral.js";


const app = express();
app.use(express.json());

// API Routes
app.get("/api/lyrics", lyricsHandler);
app.use("/api/movie", movieHandler);
app.use("/api/vehicle", vehicleHandler);
app.use("/api/gpt", gptHandler);
app.use("/api/gpt4", gptHandler4);
app.use("/api/deepseek", deepSeek);
app.use("/api/mistral", Mistral)
app.post("/api/mail", sendEmail); // Attach the mail handler

// 404 Route Handling
app.use((req, res) => {
    res.status(404).json({ error: "404: NOT FOUND" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
