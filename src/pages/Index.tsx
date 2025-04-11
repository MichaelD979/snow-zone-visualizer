
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import StockChart from "@/components/StockChart";
import StockSummary from "@/components/StockSummary";
import TradingZones from "@/components/TradingZones";
import { fetchHistoricalData, fetchLatestPrice, StockData } from "@/services/stockService";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const STOCK_SYMBOL = "SNOW";

const Index = () => {
  const { toast } = useToast();
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [previousClose, setPreviousClose] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch historical data
      const data = await fetchHistoricalData(STOCK_SYMBOL);
      setStockData(data);
      
      // Set previous close from historical data
      if (data.length > 0) {
        setPreviousClose(data[data.length - 1].close);
      }
      
      // Fetch latest price
      const price = await fetchLatestPrice(STOCK_SYMBOL);
      setLatestPrice(price);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1 font-mono bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Stock Trading Zones
              </h1>
              <p className="text-muted-foreground">
                Visualizing buy and sell zones for Snowflake Inc. (SNOW)
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <Button 
                variant="outline" 
                onClick={loadData}
                disabled={isLoading}
                className="font-mono text-sm"
              >
                <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-sm text-muted-foreground font-mono">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <StockSummary 
              symbol={STOCK_SYMBOL} 
              latestPrice={latestPrice} 
              previousClose={previousClose}
              isLoading={isLoading}
            />
          </div>
          <div className="md:col-span-2">
            <TradingZones currentPrice={latestPrice} />
          </div>
        </div>
        
        <div className="mb-8">
          <StockChart 
            data={stockData} 
            symbol={STOCK_SYMBOL} 
            isLoading={isLoading} 
          />
        </div>
        
        <footer className="text-center text-sm text-muted-foreground mt-8 pb-8">
          <p>
            Data provided by Yahoo Finance. Trading zones are for demonstration purposes only.
          </p>
          <p className="mt-1">
            This application is not financial advice. Always do your own research before investing.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
