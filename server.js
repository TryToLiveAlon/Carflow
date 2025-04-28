import express from "express";
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import gptHandler from "./api/gpt.js";
import sendEmail from "./api/mail.js";
import lyricsHandler from "./api/lyrics.js";
import gptHandler from "./api/gpt.js";



const app = express();
app.use(express.json());

// API Routes
app.get("/api/lyrics", lyricsHandler);
app.use("/api/movie", movieHandler);
app.use("/api/vehicle", vehicleHandler);
app.use("/api/gpt", gptHandler);
app.use("/api/gpt", gptHandler);
app.post("/api/mail", sendEmail); // Attach the mail handler

// 404 Route Handling
app.use((req, res) => {
    res.status(404).json({ error: "404: NOT FOUND" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
