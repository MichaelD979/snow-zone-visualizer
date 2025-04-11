
export interface StockOption {
  symbol: string;
  name: string;
  sector?: string;
}

export const stockOptions: StockOption[] = [
  { symbol: "SNOW", name: "Snowflake Inc.", sector: "Technology" },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services" }
];
