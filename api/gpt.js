import fetch from "node-fetch";

const POST_API_URL = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==";

const gptHandler = async (req, res) => {
    try {
        const userPrompt = req.query.prompt;

        if (!userPrompt) {
            return res.status(400).json({ error: "Missing 'prompt' query parameter" });
        }

        // Make a POST request using fetch
        const response = await fetch(POST_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userPrompt })
        });

        const data = await response.json();

        // Modify the response to include additional info
        const modifiedResponse = {
            ...data,
            provider: "https://t.me/TryToLiveAlon",
            api_documentation: "https://death-docs.vercel.app"
        };

        res.json(modifiedResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default gptHandler;
