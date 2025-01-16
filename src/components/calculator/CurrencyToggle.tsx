import { Button } from "@/components/ui/button";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { Currency, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CurrencyType } from "./CalculatorState";

const CONVERSION_RATES: Record<CurrencyType, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79
};

export function CurrencyToggle() {
  const { 
    currency, 
    setCurrency, 
    totalCost, 
    setTotalCost,
    setupCost,
    setSetupCost
  } = useCalculatorStateContext();
  const { toast } = useToast();
  
  const handleCurrencyToggle = () => {
    const newCurrency = currency === 'USD' ? 'EUR' : 'USD';
    const conversionRate = CONVERSION_RATES[newCurrency] / CONVERSION_RATES[currency];
    
    // Convert costs to new currency
    if (totalCost !== null) {
      setTotalCost(totalCost * conversionRate);
    }
    if (setupCost !== null) {
      setSetupCost(setupCost * conversionRate);
    }
    
    setCurrency(newCurrency);
    localStorage.setItem('preferred_currency', newCurrency);
    
    toast({
      title: "Currency Updated",
      description: `Currency changed to ${newCurrency}`,
    });
  };
  
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCurrencyToggle}
        className="flex items-center gap-2"
      >
        <Currency className="h-4 w-4" />
        {currency === 'USD' ? (
          <ToggleLeft className="h-4 w-4" />
        ) : (
          <ToggleRight className="h-4 w-4" />
        )}
        {currency}
      </Button>
    </div>
  );
}