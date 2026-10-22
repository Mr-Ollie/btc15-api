```javascript
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://mr-ollie.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const ticker = typeof req.query.ticker === 'string' ? req.query.ticker : '';
  if (!/^KXBTC15M-[A-Za-z0-9-]+$/.test(ticker)) {
    return res.status(400).json({ error: 'Valid BTC15 ticker required' });
  }

  try {
    const url = 'https://api.elections.kalshi.com/trade-api/v2/markets/' +
      encodeURIComponent(ticker) + '/orderbook';
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Kalshi order book request failed', detail: String(error.message || error) });
  }
};
```
