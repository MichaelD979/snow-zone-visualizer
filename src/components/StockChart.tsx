
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { StockData } from "@/services/stockService";
import { calculateSMA, formatDate, formatCurrency } from "@/utils/stockUtils";
import { Card, CardContent } from "@/components/ui/card";

// Define zones
const BUY_ZONE_MIN = 130;
const BUY_ZONE_MAX = 140;
const SELL_ZONE_MIN = 170;
const SELL_ZONE_MAX = 185;

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
          fillcolor: "rgba(52, 211, 153, 0.2)",
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
          fillcolor: "rgba(248, 113, 113, 0.2)",
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
            family: "JetBrains Mono",
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
            family: "JetBrains Mono",
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
              color: "#6366F1",
              width: 2,
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
              width: 2,
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
              width: 2,
              dash: "dot",
            },
            hovertemplate: "%{y:$,.2f}<extra></extra>",
          },
        ],
        layout: {
          title: {
            text: `${symbol} - 6 Month History`,
            font: {
              family: "JetBrains Mono",
              size: 20,
              color: "#E2E8F0",
            },
          },
          autosize: true,
          height: 600,
          margin: {
            l: 50,
            r: 50,
            t: 80,
            b: 50,
          },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: {
            title: "Date",
            showgrid: true,
            gridcolor: "#1F2937",
            gridwidth: 1,
            tickfont: {
              family: "JetBrains Mono",
              color: "#94A3B8",
            },
            linecolor: "#1F2937",
            zeroline: false,
          },
          yaxis: {
            title: "Price ($)",
            showgrid: true,
            gridcolor: "#1F2937",
            gridwidth: 1,
            tickfont: {
              family: "JetBrains Mono",
              color: "#94A3B8",
            },
            linecolor: "#1F2937",
            zeroline: false,
            tickprefix: "$",
            tickformat: ",.2f",
          },
          legend: {
            orientation: "h",
            xanchor: "center",
            yanchor: "top",
            x: 0.5,
            y: 1.1,
            font: {
              family: "JetBrains Mono",
              color: "#E2E8F0",
            },
            bgcolor: "rgba(0,0,0,0)",
          },
          shapes: shapes,
          annotations: annotations,
          hovermode: "closest",
        },
        config: {
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
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
      <Card className="w-full">
        <CardContent className="h-[600px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-muted-foreground font-mono">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card className="w-full">
        <CardContent className="h-[600px] flex items-center justify-center">
          <p className="text-muted-foreground font-mono">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <Plot
          data={chartData.data}
          layout={chartData.layout}
          config={chartData.config}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};

export default StockChart;
