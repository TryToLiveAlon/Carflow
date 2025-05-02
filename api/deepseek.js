export default async function handler(req, res) {
  const { query } = req;
  const text = (query.text || '').trim();

  if (!text) {
    return res.status(400).json({
      error: '⚠️ Missing text input. Provide a valid query.'
    });
  }

  const apiUrl = 'https://api.deepinfra.com/v1/openai/chat/completions';
  const payload = {
    model: 'deepseek-ai/DeepSeek-R1',
    messages: [
      { role: 'system', content: 'Be a helpful assistant' },
      { role: 'user', content: text }
    ],
    stream: false
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `❌ HTTP Error: ${response.status} - API issue detected.`
      });
    }

    const data = await response.json();

    if (!data.choices || !Array.isArray(data.choices) || !data.choices[0]?.message?.content) {
      return res.status(500).json({
        error: '⚠️ Unexpected response format from API.'
      });
    }

    return res.status(200).json({
      credit: '@TryToLiveAlon',
      response: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      error: '🚨 API is unreachable. Try again later.'
    });
  }
}
