module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await fetch(process.env.GLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`,
      'Accept-Language': 'en-US,en',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
};
