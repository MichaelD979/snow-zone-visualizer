
import yahooFinance from "yahoo-finance2";

export interface StockData {
  date: Date;
  close: number;
}

export const fetchHistoricalData = async (symbol: string): Promise<StockData[]> => {
  try {
    // Calculate dates for a 6-month period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: "1d" as "1d" | "1wk" | "1mo", // Type assertion to match the expected type
    };
    
    const result = await yahooFinance.historical(symbol, queryOptions);

    // Transform and filter the data
    return result.map((item) => ({
      date: new Date(item.date),
      close: item.close,
    }));
    
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw new Error(`Failed to fetch data for ${symbol}`);
  }
};

export const fetchLatestPrice = async (symbol: string): Promise<number> => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return quote.regularMarketPrice || 0;
  } catch (error) {
    console.error("Error fetching latest price:", error);
    throw new Error(`Failed to fetch latest price for ${symbol}`);
  }
};
