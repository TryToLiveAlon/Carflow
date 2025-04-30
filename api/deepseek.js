export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  const text = (req.query.text || '').trim();

  if (!text) {
    return res.status(400).json({ error: '⚠️ Missing text input. Provide a valid query.' });
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
      return res.status(response.status).json({ error: `❌ API Error: ${response.status}` });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: '⚠️ Unexpected API response format.' });
    }

    return res.status(200).json({
      credit: '@TryToLiveAlon',
      response: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({ error: '🚨 API unreachable or server error.' });
  }
                                 }
