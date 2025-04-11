const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/stock", async (req, res) => {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "Symbol parameter is required" });
  }

  try {
    // Calculate dates for a 6-month period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const queryOptions = {
      period1: startDate.toISOString().split("T")[0],
      period2: endDate.toISOString().split("T")[0],
      interval: "1d",
    };

    const result = await yahooFinance.historical(symbol, queryOptions);

    if (!result || !Array.isArray(result) || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the specified symbol" });
    }

    const transformedData = result.map((item) => ({
      date: new Date(item.date),
      close: item.close,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
