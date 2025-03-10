import express from "express";
import mailHandler from "./api/mail/index.js";  
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import gptHandler from "./api/gpt.js";  

const app = express();
app.use(express.json());

app.use("/api/movie", movieHandler);
app.use("/api/vehicle", vehicleHandler);
app.use("/api/gpt", gptHandler);
app.use("/api/mail", mailHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
