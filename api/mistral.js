export default async function handler(req, res) {
  const credit = { credit: "https://t.me/TryToLiveAlon" };
  const { text } = req.query;

  if (!text || !text.trim()) {
    return res.status(400).json({ ...credit, error: "❌ Missing text parameter" });
  }

  const url = "https://mistral-ai.chat/wp-admin/admin-ajax.php";
  const params = new URLSearchParams();
  params.append("action", "ai_chat_response");
  params.append("message", text.trim());
  params.append("nonce", "83103efe99");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent": "AzRBot/1.6",
        "Accept": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ...credit,
        error: `⚠️ Mistral API error: ${response.status}`
      });
    }

    const result = await response.json();
    const message = result?.data?.message?.trim() || "No valid response received.";

    res.status(200).json({
      ...credit,
      status: "✅ Success",
      message
    });
  } catch (err) {
    res.status(500).json({
      ...credit,
      error: `⚠️ API request failed: ${err.message}`
    });
  }
}
