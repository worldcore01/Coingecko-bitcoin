
export default async function handler(req, res) {
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "CoinGecko API key is missing"
    });
  }

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h",
      {
        headers: {
          "x-cg-demo-api-key": apiKey
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "CoinGecko API request failed"
      });
    }

    const data = await response.json();

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=120"
    );

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Unable to retrieve market data"
    });
  }
}
