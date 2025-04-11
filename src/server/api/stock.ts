import { defineApiRoute } from "vite-plugin-api";
import yahooFinance from "yahoo-finance2";

export default defineApiRoute({
  async GET({ query }) {
    const { symbol } = query;

    if (!symbol) {
      return {
        status: 400,
        body: { error: "Symbol parameter is required" },
      };
    }

    try {
      // Calculate dates for a 6-month period
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const queryOptions = {
        period1: startDate.toISOString().split("T")[0],
        period2: endDate.toISOString().split("T")[0],
        interval: "1d" as const,
      };

      const result = await yahooFinance.historical(symbol, queryOptions);

      if (!result || !Array.isArray(result) || result.length === 0) {
        return {
          status: 404,
          body: { error: "No data found for the specified symbol" },
        };
      }

      const transformedData = result.map((item) => ({
        date: new Date(item.date),
        close: item.close,
      }));

      return {
        status: 200,
        body: transformedData,
      };
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return {
        status: 500,
        body: { error: "Failed to fetch stock data" },
      };
    }
  },
});
