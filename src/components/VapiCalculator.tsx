
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

export function VapiCalculator() {
  const { totalMinutes, setTechnologies, technologies, currency } = useCalculatorStateContext();
  const [costPerMinute, setCostPerMinute] = useState<string>("0.1");
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '$';
    }
  };

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      case 'GBP':
        return amount * 0.814;
      default:
        return amount;
    }
  };

  // Calculate total monthly cost whenever input or total minutes change
  useEffect(() => {
    const numValue = parseFloat(costPerMinute);
    if (!isNaN(numValue) && numValue >= 0) {
      const monthlyCost = numValue * totalMinutes;
      
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'vapi' ? { ...tech, costPerMinute: monthlyCost } : tech
        )
      );
    }
  }, [costPerMinute, totalMinutes, setTechnologies]);

  const handleCostChange = (value: string) => {
    // Validate input format
    if (!/^\d*\.?\d*$/.test(value) && value !== '') {
      return;
    }
    
    setCostPerMinute(value);
  };

  const monthlyCost = parseFloat(costPerMinute) * totalMinutes;
  const convertedMonthlyCost = getCurrencyConversion(monthlyCost);

  return (
    <Card className="p-4 space-y-4">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle>Vapi Configuration</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open("https://vapi.ai/?aff=christiankams", '_blank')}
          className="flex items-center gap-1"
        >
          View Pricing <ExternalLink className="h-3 w-3" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 space-y-4">
        <div className="space-y-2">
          <Label>Cost Per Minute ({getCurrencySymbol(currency)})</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={costPerMinute}
            onChange={(e) => handleCostChange(e.target.value)}
            placeholder="0.10"
          />
        </div>

        <div className="bg-white text-gray-900 rounded-lg p-4 shadow-sm border border-border">
          <p className="font-medium">Vapi Monthly Cost</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Cost Per Minute: {getCurrencySymbol(currency)}{parseFloat(costPerMinute).toFixed(4)}</li>
            <li>Total Minutes: {totalMinutes}</li>
            <li className="font-semibold mt-2">
              Monthly Cost: {getCurrencySymbol(currency)}{convertedMonthlyCost.toFixed(2)}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
