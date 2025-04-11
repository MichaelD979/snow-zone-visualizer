
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculatePercentChange } from "@/utils/stockUtils";
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-xl">{symbol}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
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
            <div className="text-3xl font-bold">
              {latestPrice ? formatCurrency(latestPrice) : "N/A"}
            </div>
            
            {percentChange !== null && (
              <div className={`flex items-center mt-1 ${isPriceUp ? "text-buy" : "text-sell"}`}>
                {isPriceUp ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {percentChange.toFixed(2)}% {isPriceUp ? "up" : "down"}
                </span>
              </div>
            )}
            
            {previousClose && (
              <div className="text-xs text-muted-foreground mt-2">
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
