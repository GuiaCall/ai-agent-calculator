
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";
import { Label } from "./ui/label";

export function BlandAICalculator() {
  const { totalMinutes, setTechnologies, technologies, currency } = useCalculatorStateContext();
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  
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

  // Calculate the monthly cost based on total minutes
  useEffect(() => {
    const costPerMinute = 0.09; // $0.09 per minute for Bland AI
    const cost = costPerMinute * totalMinutes;
    setMonthlyCost(cost);
    
    // Update the technology parameters with the monthly cost
    setTechnologies(techs => 
      techs.map(tech => 
        tech.id === 'blandai' ? { ...tech, costPerMinute: cost } : tech
      )
    );
  }, [totalMinutes, setTechnologies, currency]);

  const convertedMonthlyCost = getCurrencyConversion(monthlyCost);
  const costPerMinute = 0.09;
  const convertedCostPerMinute = getCurrencyConversion(costPerMinute);

  return (
    <Card className="glass-card p-6 space-y-4 shadow-lg overflow-hidden border border-indigo-100">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4 border-b border-gray-100">
        <CardTitle className="text-indigo-800 font-bold text-xl flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-full">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
          </div>
          Bland AI Configuration
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open("https://www.bland.ai/pricing", '_blank')}
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
        >
          View Pricing <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 space-y-4 fade-in">
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Fixed Rate</Label>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{getCurrencySymbol(currency)}{convertedCostPerMinute.toFixed(2)} per minute</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg p-5 shadow-sm border border-indigo-100">
          <p className="font-semibold text-indigo-800 mb-3">Bland AI Monthly Cost</p>
          <ul className="list-none space-y-2">
            <li className="flex items-center justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Cost Per Minute</span>
              <span className="font-medium">{getCurrencySymbol(currency)}{convertedCostPerMinute.toFixed(2)}</span>
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
