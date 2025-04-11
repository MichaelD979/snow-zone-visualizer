
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculatePercentChange } from "@/utils/stockUtils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-mono">{symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold font-mono">
              {latestPrice ? formatCurrency(latestPrice) : "N/A"}
            </div>
            
            {percentChange !== null && (
              <div className={`flex items-center mt-1 ${isPriceUp ? "text-buy" : "text-sell"}`}>
                {isPriceUp ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span className="font-mono text-sm">
                  {percentChange.toFixed(2)}% {isPriceUp ? "up" : "down"}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StockSummary;
