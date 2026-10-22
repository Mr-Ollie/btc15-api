module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET only" });
  }

  try {
    const ticker = req.query.ticker;
    const base = "https://api.elections.kalshi.com/trade-api/v2/markets";
    let url;

    if (ticker) {
      if (!/^KXBTC15M-[A-Za-z0-9-]+$/.test(ticker)) {
        return res.status(400).json({ error: "Invalid BTC15 ticker" });
      }

      url = base + "/" + encodeURIComponent(ticker) + "/orderbook";
    } else {
      url = base + "?series_ticker=KXBTC15M&limit=100&status=open";
    }

    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });

    const data = await response.json();

    res.setHeader("Cache-Control", "no-store");
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Kalshi request failed",
      detail: String(error)
    });
  }
};
