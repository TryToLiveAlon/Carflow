const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to fetch vehicle details
app.get("/api/vehicle/:vehicleNumber", async (req, res) => {
  const vehicleNumber = req.params.vehicleNumber;

  if (!vehicleNumber) {
    return res.status(400).json({ error: "Please provide a vehicle number." });
  }

  const apiUrl = "https://www.smcinsurance.com/central/centralcall/CallReqWithHeader";

  const apiBody = {
    URL: "GetVaahanDetailsByVehicleNo",
    Props: [vehicleNumber],
  };

  const headers = {
    Cookie:
      "MCBC=3RTHdIU5%2F348nmXlg1nUJPra3Tf8KTJ0FTsTB2%2B4zZ8%3D%3Aba3cd8476600b153f8a66d22448a397d88f4842e7e6d065b92473113b125ee20; _gcl_au=1.1.2014085917.1734760610; _ga_E0SG8XLD9W=GS1.1.1734760610.1.0.1734760610.60.0.0; _ga=GA1.1.1773637558.1734760611",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(apiBody),
    });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      res.status(500).json({ error: "Failed to fetch vehicle details." });
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
