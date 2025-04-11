
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { StockData } from "@/services/stockService";
import { calculateSMA, formatDate, formatCurrency } from "@/utils/stockUtils";
import { Card, CardContent } from "@/components/ui/card";
import { stockOptions } from "@/config/stocks";

interface StockChartProps {
  data: StockData[];
  symbol: string;
  isLoading: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol, isLoading }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const dates = data.map((item) => item.date);
      const closePrices = data.map((item) => item.close);
      
      // Calculate SMAs
      const sma20 = calculateSMA(closePrices, 20);
      const sma50 = calculateSMA(closePrices, 50);
      const sma100 = calculateSMA(closePrices, 100);
      
      // Get stock name
      const stockInfo = stockOptions.find(stock => stock.symbol === symbol);
      const stockName = stockInfo?.name || symbol;
      
      // Calculate dynamic buy/sell zones based on price range
      const minPrice = Math.min(...closePrices) * 0.95;
      const maxPrice = Math.max(...closePrices) * 1.05;
      const priceRange = maxPrice - minPrice;
      
      // Buy zone in lower 20-30% of price range
      const BUY_ZONE_MIN = minPrice + (priceRange * 0.05);
      const BUY_ZONE_MAX = minPrice + (priceRange * 0.25);
      
      // Sell zone in upper 70-90% of price range
      const SELL_ZONE_MIN = minPrice + (priceRange * 0.75);
      const SELL_ZONE_MAX = maxPrice - (priceRange * 0.05);
      
      // Create shapes for buy and sell zones
      const shapes = [
        // Buy Zone
        {
          type: "rect",
          xref: "paper",
          yref: "y",
          x0: 0,
          y0: BUY_ZONE_MIN,
          x1: 1,
          y1: BUY_ZONE_MAX,
          fillcolor: "rgba(52, 211, 153, 0.1)",
          line: {
            width: 0,
          },
        },
        // Sell Zone
        {
          type: "rect",
          xref: "paper",
          yref: "y",
          x0: 0,
          y0: SELL_ZONE_MIN,
          x1: 1,
          y1: SELL_ZONE_MAX,
          fillcolor: "rgba(248, 113, 113, 0.1)",
          line: {
            width: 0,
          },
        },
      ];
      
      // Prepare annotations for zones
      const annotations = [
        {
          x: 0.02,
          y: (BUY_ZONE_MIN + BUY_ZONE_MAX) / 2,
          xref: "paper",
          yref: "y",
          text: "BUY ZONE",
          showarrow: false,
          font: {
            family: "Inter, sans-serif",
            size: 12,
            color: "rgb(52, 211, 153)",
          },
        },
        {
          x: 0.02,
          y: (SELL_ZONE_MIN + SELL_ZONE_MAX) / 2,
          xref: "paper",
          yref: "y",
          text: "SELL ZONE",
          showarrow: false,
          font: {
            family: "Inter, sans-serif",
            size: 12,
            color: "rgb(248, 113, 113)",
          },
        },
      ];
      
      setChartData({
        data: [
          // Close Price
          {
            x: dates,
            y: closePrices,
            type: "scatter",
            mode: "lines",
            name: "Close",
            line: {
              color: "#4F46E5",
              width: 2.5,
              shape: "spline",
            },
            hovertemplate: "%{y:$,.2f}<extra></extra>",
          },
          // SMA 20
          {
            x: dates,
            y: sma20,
            type: "scatter",
            mode: "lines",
            name: "SMA 20",
            line: {
              color: "#F59E0B",
              width: 1.5,
              dash: "dash",
            },
            hovertemplate: "%{y:$,.2f}<extra></extra>",
          },
          // SMA 50
          {
            x: dates,
            y: sma50,
            type: "scatter",
            mode: "lines",
            name: "SMA 50",
            line: {
              color: "#EC4899",
              width: 1.5,
              dash: "dot",
            },
            hovertemplate: "%{y:$,.2f}<extra></extra>",
          },
          // SMA 100
          {
            x: dates,
            y: sma100,
            type: "scatter",
            mode: "lines",
            name: "SMA 100",
            line: {
              color: "#14B8A6",
              width: 1.5,
              dash: "longdash",
            },
            hovertemplate: "%{y:$,.2f}<extra></extra>",
          },
        ],
        layout: {
          title: {
            text: `${symbol} - ${stockName}`,
            font: {
              family: "Inter, sans-serif",
              size: 20,
              color: "#18181B",
              weight: 600,
            },
            x: 0.01, // Left-aligned title
            xanchor: 'left',
            y: 0.95,
          },
          autosize: true,
          height: 600,
          margin: {
            l: 50,
            r: 30,
            t: 80,
            b: 50,
          },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: {
            title: "Date",
            showgrid: true,
            gridcolor: "#F1F5F9",
            gridwidth: 1,
            tickfont: {
              family: "Inter, sans-serif",
              color: "#71717A",
              size: 10,
            },
            linecolor: "#E4E4E7",
            zeroline: false,
            rangeslider: {
              visible: true,
              thickness: 0.05,
            },
          },
          yaxis: {
            title: "Price ($)",
            showgrid: true,
            gridcolor: "#F1F5F9",
            gridwidth: 1,
            tickfont: {
              family: "Inter, sans-serif",
              color: "#71717A",
              size: 10,
            },
            linecolor: "#E4E4E7",
            zeroline: false,
            tickprefix: "$",
            tickformat: ",.2f",
            fixedrange: false,
          },
          legend: {
            orientation: "h",
            xanchor: "center",
            yanchor: "top",
            x: 0.5,
            y: 1.12,
            font: {
              family: "Inter, sans-serif",
              color: "#18181B",
              size: 11,
            },
            bgcolor: "rgba(0,0,0,0)",
          },
          shapes: shapes,
          annotations: annotations,
          hovermode: "closest",
          dragmode: "zoom",
          modebar: {
            orientation: "v",
            bgcolor: "rgba(255,255,255,0.9)",
            color: "#71717A",
            activecolor: "#4F46E5",
          },
        },
        config: {
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          scrollZoom: true,
          modeBarButtonsToAdd: ["drawline", "drawopenpath", "eraseshape"],
          modeBarButtonsToRemove: [
            "lasso2d",
            "select2d",
            "toggleSpikelines",
          ],
        },
      });
    }
  }, [data, symbol]);

  if (isLoading) {
    return (
      <Card className="w-full border border-zinc-100 shadow-lg">
        <CardContent className="h-[600px] flex items-center justify-center p-0">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card className="w-full">
        <CardContent className="h-[600px] flex items-center justify-center">
          <p className="text-zinc-500 font-medium">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden border-zinc-100 shadow-lg">
      <CardContent className="p-0">
        <Plot
          data={chartData.data}
          layout={chartData.layout}
          config={chartData.config}
          className="w-full"
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
        />
      </CardContent>
    </Card>
  );
};

export default StockChart;
