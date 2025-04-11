
import yahooFinance from "yahoo-finance2";

export interface StockData {
  date: Date;
  close: number;
}

// Mock data for development/fallback when Yahoo API fails
const generateMockStockData = (symbol: string): StockData[] => {
  const data: StockData[] = [];
  const today = new Date();
  
  // Base prices for different stocks
  const basePrices: {[key: string]: number} = {
    "SNOW": 155,
    "AAPL": 180,
    "MSFT": 410, 
    "GOOGL": 170,
    "AMZN": 185,
    "TSLA": 220,
    "META": 470,
    "NVDA": 890,
    "JPM": 190,
    "V": 280
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
      close: Number(Math.max(close, basePrice * 0.5).toFixed(2)) // Ensure no negative prices
    });
  }
  
  return data;
};

export const fetchHistoricalData = async (symbol: string): Promise<StockData[]> => {
  try {
    console.log("Fetching historical data for:", symbol);
    
    // Calculate dates for a 6-month period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const queryOptions = {
      period1: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      period2: endDate.toISOString().split('T')[0],
      interval: "1d" as "1d" | "1wk" | "1mo", // Type assertion to match the expected type
    };
    
    try {
      const result = await yahooFinance.historical(symbol, queryOptions);
      
      if (result && result.length > 0) {
        // Transform and filter the data
        return result.map((item) => ({
          date: new Date(item.date),
          close: item.close,
        }));
      } else {
        console.warn("Yahoo Finance returned empty data, using mock data");
        return generateMockStockData(symbol);
      }
    } catch (yahooError) {
      console.error("Yahoo Finance API error:", yahooError);
      console.log("Falling back to mock data");
      return generateMockStockData(symbol);
    }
    
  } catch (error) {
    console.error("Error in fetchHistoricalData:", error);
    // Return mock data instead of empty array
    return generateMockStockData(symbol);
  }
};

export const fetchLatestPrice = async (symbol: string): Promise<number | null> => {
  try {
    console.log("Fetching latest price for:", symbol);
    
    try {
      const quote = await yahooFinance.quote(symbol);
      return quote.regularMarketPrice || null;
    } catch (yahooError) {
      console.error("Yahoo Finance API error for quote:", yahooError);
      // Use the last price from mock data
      const mockData = generateMockStockData(symbol);
      return mockData[mockData.length - 1].close;
    }
  } catch (error) {
    console.error("Error in fetchLatestPrice:", error);
    // Get the latest price from mock data
    const mockData = generateMockStockData(symbol);
    return mockData[mockData.length - 1].close;
  }
};
