
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.COINGECKO_DEMO_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "CoinGecko API key is not configured"
    });
  }

  try {
    const url = new URL(
      "https://api.coingecko.com/api/v3/coins/markets"
    );

    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set(
      "ids",
      "bitcoin,ethereum,solana"
    );
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "false");
    url.searchParams.set(
      "price_change_percentage",
      "24h"
    );

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "CoinGecko API request failed",
        details: data
      });
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=120"
    );

    return res.status(200).json({
      success: true,
      currency: "usd",
      last_updated: new Date().toISOString(),
      coins: data
    });

  } catch (error) {
    return res.status(500).json({
      error: "Unable to retrieve market data"
    });
  }
}
