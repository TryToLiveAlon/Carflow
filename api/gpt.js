
import axios from "axios";

const POST_API_URL = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==";

const gptHandler = async (req, res) => {
    try {
        // Extract query parameter ?prompt=your_text
        const userPrompt = req.query.prompt;

        if (!userPrompt) {
            return res.status(400).json({ error: "Missing 'prompt' query parameter" });
        }

        // Make a POST request to the existing API
        const response = await axios.post(POST_API_URL, { prompt: userPrompt });

        // Modify the response to include additional info
        const modifiedResponse = {
            ...response.data,
            additional_info: [
                { provider: "Trytolivealon" },
                { api_documentation: "here" }
            ]
        };

        res.json(modifiedResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default gptHandler;
