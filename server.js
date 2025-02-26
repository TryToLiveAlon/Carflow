import express from "express";
import movieHandler from "./api/movie.js"; // Importing movie API
import vehicleHandler from "./api/vehicle.js"; // Importing vehicle API

const app = express();
app.use(express.json());

app.post("/api/movie", movieHandler);
app.get("/api/vehicle", vehicleHandler); // Adjust method if needed

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
