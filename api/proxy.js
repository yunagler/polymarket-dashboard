export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const ALLOWED = [
    'https://gamma-api.polymarket.com',
    'https://clob.polymarket.com',
    'https://data-api.polymarket.com'
  ];

  if (!ALLOWED.some(a => url.startsWith(a))) {
    return res.status(403).json({ error: 'URL not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PolymarketDashboard/1.0'
      }
    });
    
    const data = await response.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(response.status).send(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
