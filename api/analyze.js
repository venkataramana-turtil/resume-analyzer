module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GLM_API_KEY;
  const apiUrl = process.env.GLM_API_URL;

  if (!apiKey || !apiUrl) {
    return res.status(500).json({ error: 'Server misconfiguration: API credentials not set in environment variables.' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept-Language': 'en-US,en',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: `Upstream API error: ${err.message}` });
  }
};
