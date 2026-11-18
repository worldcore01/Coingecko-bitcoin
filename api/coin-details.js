
export default async function handler(req, res) {
  const { id = "bitcoin" } = req.query;

  const allowedCoins = ["bitcoin", "ethereum"];

  if (!allowedCoins.includes(id)) {
    return res.status(400).json({
      error: "Unsupported coin"
    });
  }

  const key = process.env.COINGECKO_DEMO_API_KEY;

  if (!key) {
    return res.status(500).json({
      error: "CoinGecko API key is not configured"
    });
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": key
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch coin details"
    });
  }
}
