import express from "express";
import fetch from "node-fetch"; // Use v2 for CommonJS/ESM compatibility

const router = express.Router();

router.get("/", async (req, res) => {
  const credit = { credit: "@AzR_projects" };
  const text = (req.query.text || "").trim();

  if (!text) {
    return res.status(400).json({ ...credit, error: "❌ Missing text parameter" });
  }

  const url = "https://mistral-ai.chat/wp-admin/admin-ajax.php";
  const formData = new URLSearchParams();
  formData.append("action", "ai_chat_response");
  formData.append("message", text);
  formData.append("nonce", "83103efe99");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent": "AzRBot/1.6",
        "Accept": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    if (!response.ok) {
      return res.status(response.status).json({ ...credit, error: `⚠️ API error: ${response.status}` });
    }

    const apiResponse = await response.json();
    const message = apiResponse?.data?.message?.trim() || "No valid response received.";

    return res.json({
      ...credit,
      status: "✅ Success",
      message
    });

  } catch (error) {
    return res.status(500).json({
      ...credit,
      error: `⚠️ API request failed: ${error.message}`
    });
  }
});

export default router;
           
