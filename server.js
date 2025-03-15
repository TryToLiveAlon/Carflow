import express from "express";
import movieHandler from "./api/movie.js";  
import vehicleHandler from "./api/vehicle.js";  
import gptHandler from "./api/gpt.js";
import mailHandler from "./api/mail.js";

const app = express();
app.use(express.json());
// ✅ API Routes
app.use("/api/movie", movieHandler);
app.use("/api/vehicle", vehicleHandler);
app.use("/api/gpt", gptHandler);
app.use("/api/mail", mailHandler);  // ✅ Use mail API

// ❌ Handle 404 - Route Not Found
app.use((req, res) => {
    res.status(404).json({ error: "404: NOT FOUND" });
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
