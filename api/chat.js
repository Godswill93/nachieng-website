module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Explicitly parse body
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { messages, system } = body || {};

  if (!messages || !system) {
    return res.status(400).json({ 
      error: 'Missing fields',
      received: { hasMessages: !!messages, hasSystem: !!system, bodyType: typeof body }
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) {
      return res.status(500).json({ error: 'Invalid response from Anthropic', raw: text.substring(0, 200) });
    }

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};
