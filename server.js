import express from "express";
import movieHandler from "./api/movie.js"; // Importing movie API
import vehicleHandler from "./api/vehicle.js"; // Importing vehicle API
import gptHandler from "./api/gpt.js";

const app = express();
app.use(express.json());

app.get("/api/movie", movieHandler); // Changed to GET request
app.get("/api/vehicle", vehicleHandler); // Vehicle API remains the same
app.get("/api/gpt", gptHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
