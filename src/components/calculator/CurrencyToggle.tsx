
import { Button } from "@/components/ui/button";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { Currency, DollarSign, Euro, PoundSterling } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CurrencyType } from "./CalculatorState";

const CONVERSION_RATES: Record<CurrencyType, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79
};

const CURRENCY_ICONS = {
  USD: <DollarSign className="h-4 w-4" />,
  EUR: <Euro className="h-4 w-4" />,
  GBP: <PoundSterling className="h-4 w-4" />
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
    const currencies: CurrencyType[] = ['USD', 'EUR', 'GBP'];
    const currentIndex = currencies.indexOf(currency);
    const newIndex = (currentIndex + 1) % currencies.length;
    const newCurrency = currencies[newIndex];
    
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
    <div className="flex items-center mb-6 justify-start">
      <Button
        onClick={handleCurrencyToggle}
        className="relative group overflow-hidden rounded-full border-2 border-primary/20 hover:border-primary/50 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 shadow-sm hover:shadow-md transition-all duration-300 px-5 py-2 h-auto"
      >
        <div className="flex items-center gap-2">
          <Currency className="h-5 w-5 text-primary-600 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-primary-700 flex items-center gap-2">
            {CURRENCY_ICONS[currency]}
            {currency}
          </span>
          <span className="absolute -right-8 top-0 h-full w-16 bg-white/20 skew-x-12 transform translate-x-0 transition-transform duration-700 ease-in-out group-hover:translate-x-20"></span>
        </div>
      </Button>
      <div className="ml-3 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
        Click to change currency
      </div>
    </div>
  );
}
