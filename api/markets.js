module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET only" });
  }

  try {
    const url = "https://api.elections.kalshi.com/trade-api/v2/markets?series_ticker=KXBTC15M&limit=1";
    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Kalshi request failed",
      detail: String(error)
    });
  }
};
