import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StockOption } from "@/config/stocks";

interface StockSelectorProps {
  stocks: StockOption[];
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
  isLoading?: boolean;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  stocks = [], // Provide default empty array to prevent undefined
  selectedStock,
  onSelectStock,
  isLoading = false,
}) => {
  const [open, setOpen] = React.useState(false);

  // Make sure to handle potentially undefined selectedStockDetails
  const selectedStockDetails = stocks.find(
    (stock) => stock.symbol === selectedStock
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className="w-full md:w-[250px] justify-between bg-white/50 border-zinc-200 hover:bg-white/80 transition-all"
        >
          {selectedStock ? (
            <>
              <span className="font-semibold">{selectedStock}</span>
              <span className="text-muted-foreground text-xs ml-2 truncate">
                {selectedStockDetails?.name}
              </span>
            </>
          ) : (
            "Select stock..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search stock..." />
          <CommandEmpty>No stock found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {Array.isArray(stocks) && stocks.length > 0 ? (
              stocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} ${stock.name}`}
                  onSelect={() => {
                    onSelectStock(stock.symbol);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStock === stock.symbol
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="text-xs text-muted-foreground">
                      {stock.name}
                    </span>
                  </div>
                </CommandItem>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No stocks available
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StockSelector;
