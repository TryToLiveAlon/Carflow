import express from "express";
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import gptHandler from "./api/gpt.js";  
import mailHandler from "./api/mail.js";

const app = express();
app.use(express.json());

app.get("/api/movie", movieHandler);
app.get("/api/vehicle", vehicleHandler);
app.get("/api/gpt", gptHandler);
app.use("/api/mail", mailHandler);

const PORT = 3000;  // No dotenv, directly defining PORT
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
