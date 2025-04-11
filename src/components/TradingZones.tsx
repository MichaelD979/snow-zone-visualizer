
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/stockUtils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface TradingZonesProps {
  currentPrice: number | null;
}

const BUY_ZONE_MIN = 130;
const BUY_ZONE_MAX = 140;
const SELL_ZONE_MIN = 170;
const SELL_ZONE_MAX = 185;

const TradingZones: React.FC<TradingZonesProps> = ({ currentPrice }) => {
  // Determine if price is in buy or sell zone
  const isInBuyZone = currentPrice !== null && 
    currentPrice >= BUY_ZONE_MIN && 
    currentPrice <= BUY_ZONE_MAX;
  
  const isInSellZone = currentPrice !== null && 
    currentPrice >= SELL_ZONE_MIN && 
    currentPrice <= SELL_ZONE_MAX;
  
  // Calculate distance to zones if not in a zone
  const distanceToBuyZone = currentPrice !== null && !isInBuyZone
    ? currentPrice < BUY_ZONE_MIN 
      ? BUY_ZONE_MIN - currentPrice 
      : null
    : null;
  
  const distanceToSellZone = currentPrice !== null && !isInSellZone
    ? currentPrice < SELL_ZONE_MIN 
      ? SELL_ZONE_MIN - currentPrice 
      : null
    : null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className={isInBuyZone ? "border-buy" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-mono text-buy">
            <ArrowDownIcon className="h-4 w-4 mr-2" />
            Buy Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono">
            {formatCurrency(BUY_ZONE_MIN)} - {formatCurrency(BUY_ZONE_MAX)}
          </div>
          
          {currentPrice !== null && (
            <div className="mt-2 text-sm text-muted-foreground font-mono">
              {isInBuyZone ? (
                <span className="text-buy font-bold">Currently in buy zone</span>
              ) : distanceToBuyZone !== null ? (
                <span>{formatCurrency(distanceToBuyZone)} below buy zone</span>
              ) : (
                <span>Above buy zone</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className={isInSellZone ? "border-sell" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-mono text-sell">
            <ArrowUpIcon className="h-4 w-4 mr-2" />
            Sell Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono">
            {formatCurrency(SELL_ZONE_MIN)} - {formatCurrency(SELL_ZONE_MAX)}
          </div>
          
          {currentPrice !== null && (
            <div className="mt-2 text-sm text-muted-foreground font-mono">
              {isInSellZone ? (
                <span className="text-sell font-bold">Currently in sell zone</span>
              ) : distanceToSellZone !== null ? (
                <span>{formatCurrency(distanceToSellZone)} below sell zone</span>
              ) : (
                <span>Above sell zone</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingZones;
