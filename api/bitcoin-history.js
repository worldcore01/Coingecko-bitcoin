
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const date = req.query.date || "18-11-2026";

  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return res.status(400).json({ error: "Date must be DD-MM-YYYY" });
  }

  const key = process.env.COINGECKO_DEMO_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const url = new URL(
      "https://api.coingecko.com/api/v3/coins/bitcoin/history"
    );
    url.searchParams.set("date", date);

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": key
      }
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Unable to retrieve Bitcoin history"
    });
  }
}
