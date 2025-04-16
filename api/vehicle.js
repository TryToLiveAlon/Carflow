export default async function handler(req, res) {
  if (req.method === "GET") {
    const { numberPalate } = req.query;

    if (!numberPalate) {
      return res.status(400).json({
        error: "Vehicle number is required as a query parameter",
      });
    }

    try {
      const apiUrl = "https://www.smcinsurance.com/central/centralcall/CallReqWithHeader";

      const apiBody = {
        URL: "GetVaahanDetailsByVehicleNo",
        Props: [numberPalate],
      };

      // Cookies copied from PHP code
      const cookies =
        "MCBC=3RTHdIU5%2F348nmXlg1nUJPra3Tf8KTJ0FTsTB2%2B4zZ8%3D%3Aba3cd8476600b153f8a66d22448a397d88f4842e7e6d065b92473113b125ee20; _gcl_au=1.1.2014085917.1734760610; _ga_E0SG8XLD9W=GS1.1.1734760610.1.0.1734760610.60.0.0; _ga=GA1.1.1773637558.1734760611";

      const headers = {
        "Content-Type": "application/json",
        Cookie: cookies,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(apiBody),
      });

      const data = await response.json();

      if (response.ok) {
        return res.status(200).json(data);
      } else {
        return res.status(response.status).json({
          error: "Failed to fetch vehicle details",
          details: data,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      error: "Method not allowed",
    });
  }
}
