import { Button } from "@/components/ui/button";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { Currency, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCalculatorStateContext();
  const { toast } = useToast();
  
  const handleCurrencyToggle = () => {
    const newCurrency = currency === 'USD' ? 'EUR' : 'USD';
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