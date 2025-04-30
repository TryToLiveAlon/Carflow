import axios from "axios";

const OIVSCode = {
  apiBase: "https://oi-vscode-server-2.onrender.com/v1",
  model: "gpt-4o-mini-2024-07-18",
  modelAliases: {
    "gpt-4o-mini": "gpt-4o-mini-2024-07-18"
  }
};

function resolveModelName(inputModel) {
  return OIVSCode.modelAliases[inputModel?.toLowerCase()] || OIVSCode.model;
}

export default async function handler(req, res) {
  let messages, stream = false, max_tokens = 2000, temperature = 0.7, model;

  if (req.method === "POST") {
    // Extract from JSON body
    ({ messages, stream = false, max_tokens = 2000, temperature = 0.7, model } = req.body);
  } else if (req.method === "GET") {
    // Extract from query string
    const prompt = req.query.prompt; // Get 'prompt' from query
    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' parameter" });
    }

    messages = [{ role: "user", content: prompt }];
    stream = req.query.stream === "true";
    max_tokens = parseInt(req.query.max_tokens || "2000");
    temperature = parseFloat(req.query.temperature || "0.7");
    model = req.query.model || OIVSCode.model;
  } else {
    return res.status(405).json({ error: "Only GET and POST methods are allowed" });
  }

  const resolvedModel = resolveModelName(model);

  try {
    if (stream) {
      const response = await axios({
        method: 'post',
        url: `${OIVSCode.apiBase}/chat/completions`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        data: {
          model: resolvedModel,
          messages,
          stream: true,
          max_tokens,
          temperature
        },
        responseType: 'stream'
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Model', resolvedModel);

      response.data.pipe(res);
    } else {
      const response = await axios.post(
        `${OIVSCode.apiBase}/chat/completions`,
        {
          model: resolvedModel,
          messages,
          stream: false,
          max_tokens,
          temperature
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      res.status(200).json(response.data);
    }
  } catch (error) {
    console.error("GPT4 API Error:", error.message);
    res.status(500).json({ error: "Request failed", details: error.response?.data || error.message });
  }
  }
        
