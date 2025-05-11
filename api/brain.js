import fetch from "node-fetch";

const POST_API_URL = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==";

const gptHandler = async (req, res) => {
    try {
        const userPrompt = req.query.prompt;

        if (!userPrompt) {
            return res.status(400).json({ error: "Missing 'prompt' query parameter" });
        }

        // POST request to the GPT API
        const response = await fetch(POST_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "GPT-Bot/1.0"
            },
            body: JSON.stringify({ prompt: userPrompt.trim() })
        });

        // Check for a successful response
        if (!response.ok) {
            console.error("API Error:", response.statusText);
            return res.status(response.status).json({ error: "Failed to fetch response from API" });
        }

        const data = await response.json();

        // Adding additional info
        const modifiedResponse = {
            ...data,
            provider: "https://t.me/TeleAPI_service",
            api_documentation: "https://teleapi-two.vercel.app/docs/getting-started/introduction"
        };

        res.json(modifiedResponse);
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default gptHandler;
