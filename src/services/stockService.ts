import yahooFinance from "yahoo-finance2";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

export interface StockData {
  date: Date;
  close: number;
}

interface ApiResponseItem {
  date: string;
  close: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
let lastRequestTime = 0;

// Helper function to enforce rate limiting
const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
};

// Validate stock data
const validateStockData = (data: StockData[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) return false;

  return data.every(
    (item) =>
      item.date instanceof Date &&
      typeof item.close === "number" &&
      !isNaN(item.close) &&
      item.close > 0
  );
};

// Mock data for development/fallback when Yahoo API fails
const generateMockStockData = (symbol: string): StockData[] => {
  const data: StockData[] = [];
  const today = new Date();

  // Base prices for different stocks
  const basePrices: { [key: string]: number } = {
    SNOW: 142,
    AAPL: 180,
    MSFT: 410,
    GOOGL: 170,
    AMZN: 185,
    TSLA: 220,
    META: 470,
    NVDA: 890,
    JPM: 190,
    V: 280,
  };

  // Set base price, default to 100 if symbol not found
  const basePrice = basePrices[symbol] || 100;

  // Volatility factor - higher for more volatile stocks
  const volatilityFactor = symbol === "TSLA" || symbol === "NVDA" ? 2 : 1;

  // Generate 6 months of daily data
  for (let i = 180; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Create some realistic price movements with more variability for volatile stocks
    const randomChange = (Math.random() - 0.5) * 3 * volatilityFactor;
    const trendComponent = Math.sin(i / 30) * 15;
    const upwardTrend = (i / 10) * (Math.random() > 0.3 ? 1 : -1); // Sometimes downtrend
    const close = basePrice + trendComponent + upwardTrend + randomChange;

    data.push({
      date: new Date(date),
      close: Number(Math.max(close, basePrice * 0.5).toFixed(2)), // Ensure no negative prices
    });
  }

  return data;
};

export const fetchHistoricalData = async (
  symbol: string,
  retries: number = 3
): Promise<StockData[]> => {
  try {
    console.log("Fetching historical data for:", symbol);

    const response = await fetch(
      `${API_BASE_URL}/api/stock?symbol=${encodeURIComponent(symbol)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch stock data");
    }

    const data = (await response.json()) as ApiResponseItem[];
    return data.map((item) => ({
      date: new Date(item.date),
      close: item.close,
    }));
  } catch (error) {
    console.error("Error fetching historical data:", error);

    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts remaining)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchHistoricalData(symbol, retries - 1);
    }

    throw new Error(
      `Failed to fetch historical data for ${symbol} after multiple attempts: ${error.message}`
    );
  }
};

export const fetchLatestPrice = async (
  symbol: string,
  retries: number = 3
): Promise<number> => {
  try {
    console.log("Fetching latest price for:", symbol);

    const response = await fetch(
      `${API_BASE_URL}/api/stock?symbol=${encodeURIComponent(symbol)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch stock data");
    }

    const data = (await response.json()) as ApiResponseItem[];
    if (!data || data.length === 0) {
      throw new Error("No data received");
    }

    // Return the most recent price
    return data[data.length - 1].close;
  } catch (error) {
    console.error("Error fetching latest price:", error);

    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts remaining)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchLatestPrice(symbol, retries - 1);
    }

    throw new Error(
      `Failed to fetch latest price for ${symbol} after multiple attempts: ${error.message}`
    );
  }
};
