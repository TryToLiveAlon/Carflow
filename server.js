import express from "express";
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import gptHandler from "./api/gpt.js";
import mailHandler from "./api/mail.js";

const app = express();
app.use(express.json());

app.use("/api/movie", movieHandler);
app.use("/api/vehicle", vehicleHandler);
app.use("/api/gpt", gptHandler);
app.use("/api/mail", mailHandler);

app.use((req, res) => {
    res.status(404).json({ error: "404: NOT FOUND" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
