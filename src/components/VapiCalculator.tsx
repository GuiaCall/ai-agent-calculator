import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

export function VapiCalculator() {
  const { totalMinutes, setTechnologies, technologies, currency } = useCalculatorStateContext();
  const [costPerMinute, setCostPerMinute] = useState<string>("0.1");
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      default:
        return amount;
    }
  };

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
    if (!/^\d*\.?\d*$/.test(value) && value !== '') {
      return;
    }
    
    setCostPerMinute(value);
  };

  const monthlyCost = parseFloat(costPerMinute) * totalMinutes;
  const convertedMonthlyCost = getCurrencyConversion(monthlyCost);

  return (
    <Card className="glass-card p-6 space-y-4 shadow-lg overflow-hidden border border-indigo-100">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4 border-b border-gray-100">
        <CardTitle className="text-indigo-800 font-bold text-xl flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          Vapi Configuration
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open("https://vapi.ai/?aff=christiankams", '_blank')}
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
        >
          View Pricing <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 space-y-4 fade-in">
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Cost Per Minute ({getCurrencySymbol(currency)})</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={costPerMinute}
            onChange={(e) => handleCostChange(e.target.value)}
            placeholder="0.10"
            className="border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg p-5 shadow-sm border border-indigo-100">
          <p className="font-semibold text-indigo-800 mb-3">Vapi Monthly Cost</p>
          <ul className="list-none space-y-2">
            <li className="flex items-center justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Cost Per Minute</span>
              <span className="font-medium">{getCurrencySymbol(currency)}{parseFloat(costPerMinute).toFixed(4)}</span>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Total Minutes</span>
              <span className="font-medium">{totalMinutes}</span>
            </li>
            <li className="flex items-center justify-between py-2 mt-1 bg-indigo-50 rounded-md px-3">
              <span className="font-semibold text-indigo-900">Monthly Cost</span>
              <span className="font-bold text-lg text-indigo-900">{getCurrencySymbol(currency)}{convertedMonthlyCost.toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
