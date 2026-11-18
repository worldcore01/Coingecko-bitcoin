
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
      error: "Missing CoinGecko API key"
    });
  }

  const url = new URL(
    "https://api.coingecko.com/api/v3/coins/markets"
  );

  url.search = new URLSearchParams({
    vs_currency: "usd",
    ids: "bitcoin,ethereum,solana",
    order: "market_cap_desc",
    per_page: "100",
    page: "1",
    sparkline: "false",
    price_change_percentage: "24h"
  }).toString();

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "CoinGecko request failed",
        details: data?.error ||
          data?.status?.error_message ||
          "API error"
      });
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=120"
    );

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);

    return res.status(502).json({
      error: "Unable to reach CoinGecko"
    });
  }
}
