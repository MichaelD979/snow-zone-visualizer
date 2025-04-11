
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import StockChart from "@/components/StockChart";
import StockSummary from "@/components/StockSummary";
import TradingZones from "@/components/TradingZones";
import StockSelector from "@/components/StockSelector";
import { fetchHistoricalData, fetchLatestPrice, StockData } from "@/services/stockService";
import { RefreshCwIcon, TrendingUpIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stockOptions } from "@/config/stocks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DEFAULT_STOCK_SYMBOL = "SNOW";

const Index = () => {
  const { toast } = useToast();
  const [stockSymbol, setStockSymbol] = useState<string>(DEFAULT_STOCK_SYMBOL);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [previousClose, setPreviousClose] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch historical data
      const data = await fetchHistoricalData(symbol);
      
      if (data.length === 0) {
        throw new Error("No historical data available");
      }
      
      setStockData(data);
      
      // Set previous close from historical data
      if (data.length > 0) {
        setPreviousClose(data[data.length - 1].close);
      }
      
      // Fetch latest price
      const price = await fetchLatestPrice(symbol);
      if (price === null) {
        throw new Error("Could not fetch latest price");
      }
      
      setLatestPrice(price);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Failed to load data:", error);
      setError((error as Error).message || "Failed to load stock data");
      toast({
        title: "Error",
        description: "Failed to load stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (symbol: string) => {
    setStockSymbol(symbol);
    loadData(symbol);
  };

  // Load data on initial render
  useEffect(() => {
    loadData(stockSymbol);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1 font-sans flex items-center">
                <TrendingUpIcon className="mr-2 h-8 w-8 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Stock Trading Zones
                </span>
              </h1>
              <p className="text-zinc-500">
                Visualizing buy and sell zones for top market stocks
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
              <StockSelector 
                stocks={stockOptions} 
                selectedStock={stockSymbol}
                onSelectStock={handleStockChange}
                isLoading={isLoading}
              />
              
              <Button 
                variant="outline" 
                onClick={() => loadData(stockSymbol)}
                disabled={isLoading}
                className="font-medium shadow-sm transition-all hover:shadow-md bg-white/50 hover:bg-white/80"
              >
                <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {lastUpdated && (
              <p className="text-sm text-zinc-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            
            {error && (
              <p className="text-sm text-destructive">
                Error: {error}
              </p>
            )}
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <StockSummary 
              symbol={stockSymbol} 
              latestPrice={latestPrice} 
              previousClose={previousClose}
              isLoading={isLoading}
            />
          </div>
          <div className="md:col-span-2">
            <TradingZones currentPrice={latestPrice} />
          </div>
        </div>
        
        <div className="mb-8 shadow-lg rounded-lg overflow-hidden backdrop-blur-sm bg-white/60 border border-zinc-100">
          <StockChart 
            data={stockData} 
            symbol={stockSymbol} 
            isLoading={isLoading} 
          />
        </div>
        
        <footer className="flex justify-between items-start py-6 px-4 border-t border-zinc-100 text-sm text-zinc-400 mt-8">
          <div>
            <p>
              Data provided by Yahoo Finance. Trading zones are for demonstration purposes only.
            </p>
            <p className="mt-1">
              This application is not financial advice. Always do your own research before investing.
            </p>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <InfoIcon className="h-5 w-5 text-zinc-300 hover:text-zinc-400 transition-colors" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Buy and sell zones are pre-configured levels for demonstration.
                  These zones would normally be calculated based on technical analysis.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </footer>
      </div>
    </div>
  );
};

export default Index;
