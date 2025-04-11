
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculatePercentChange } from "@/utils/stockUtils";
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { stockOptions } from "@/config/stocks";

interface StockSummaryProps {
  symbol: string;
  latestPrice: number | null;
  previousClose: number | null;
  isLoading: boolean;
}

const StockSummary: React.FC<StockSummaryProps> = ({
  symbol,
  latestPrice,
  previousClose,
  isLoading,
}) => {
  // Calculate percentage change if both prices are available
  const percentChange = latestPrice && previousClose
    ? calculatePercentChange(latestPrice, previousClose)
    : null;
  
  // Determine if price is up or down
  const isPriceUp = percentChange !== null ? percentChange >= 0 : false;
  
  const stockInfo = stockOptions.find(stock => stock.symbol === symbol);
  const stockName = stockInfo?.name || symbol;
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm bg-white/60 border-zinc-100">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl font-bold">{symbol}</CardTitle>
          <p className="text-sm text-zinc-500">{stockName}</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-zinc-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Latest stock price information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
              {latestPrice ? formatCurrency(latestPrice) : "N/A"}
            </div>
            
            {percentChange !== null && (
              <div className={`flex items-center mt-1 ${isPriceUp ? "text-emerald-500" : "text-rose-500"}`}>
                {isPriceUp ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(percentChange).toFixed(2)}% {isPriceUp ? "up" : "down"}
                </span>
              </div>
            )}
            
            {previousClose && (
              <div className="text-xs text-zinc-400 mt-2">
                Previous close: {formatCurrency(previousClose)}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StockSummary;
