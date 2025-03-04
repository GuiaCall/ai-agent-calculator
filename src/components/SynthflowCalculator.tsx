
import { useState, useEffect } from "react";
import { SynthflowPlan } from "@/types/synthflow";
import { SYNTHFLOW_PLANS, SYNTHFLOW_PRICING_URL } from "@/constants/synthflowPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Activity } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

interface SynthflowCalculatorProps {
  totalMinutes: number;
  onPlanSelect: (plan: SynthflowPlan | null) => void;
}

export function SynthflowCalculator({
  totalMinutes,
  onPlanSelect,
}: SynthflowCalculatorProps) {
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { currency, setTechnologies } = useCalculatorStateContext();
  
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
  
  // Calculate costs for all plans based on minutes and billing type
  const plansWithCosts = SYNTHFLOW_PLANS.map(plan => {
    const basePrice = billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const overageMinutes = Math.max(0, totalMinutes - plan.minutesPerMonth);
    const overageCost = overageMinutes * 0.13;
    const totalCost = basePrice + overageCost;
    const costPerMinute = totalMinutes > 0 ? totalCost / totalMinutes : 0;
    
    return {
      ...plan,
      overageMinutes,
      overageCost,
      totalCost,
      costPerMinute,
      isRecommended: false
    };
  });
  
  // Find recommended plan (lowest total cost)
  const recommendedPlan = [...plansWithCosts].sort((a, b) => a.totalCost - b.totalCost)[0];
  
  // Apply recommended flag
  const enhancedPlans = plansWithCosts.map(plan => ({
    ...plan,
    isRecommended: plan.name === recommendedPlan.name
  }));

  useEffect(() => {
    // Set recommended plan as default selection if no plan is selected
    if (!selectedPlanId && recommendedPlan) {
      setSelectedPlanId(recommendedPlan.name);
      
      // Update parent component with selected plan data
      const selectedPlanWithCost = {
        ...recommendedPlan,
        costPerMinute: recommendedPlan.costPerMinute
      };
      
      onPlanSelect(selectedPlanWithCost);
      
      // Update technology parameter with monthly cost
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'synthflow' ? { ...tech, costPerMinute: recommendedPlan.totalCost } : tech
        )
      );
    }
  }, [recommendedPlan, selectedPlanId, onPlanSelect, setTechnologies]);

  const handlePlanChange = (planName: string) => {
    setSelectedPlanId(planName);
    
    const selectedPlan = enhancedPlans.find(p => p.name === planName);
    if (selectedPlan) {
      onPlanSelect({
        ...selectedPlan,
        costPerMinute: selectedPlan.costPerMinute
      });
      
      // Update technology parameter with monthly cost
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'synthflow' ? { ...tech, costPerMinute: selectedPlan.totalCost } : tech
        )
      );
    }
  };

  const toggleBillingType = () => {
    const newBillingType = billingType === 'monthly' ? 'yearly' : 'monthly';
    setBillingType(newBillingType);
    
    // Reset selected plan to trigger recalculation
    setSelectedPlanId(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          Synthflow Plan Calculator
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${billingType === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch 
            checked={billingType === 'yearly'} 
            onCheckedChange={toggleBillingType} 
          />
          <span className={`text-sm ${billingType === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
            Yearly
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Select a Plan</Label>
            <RadioGroup 
              className="grid gap-4 mt-3"
              value={selectedPlanId || ''}
              onValueChange={handlePlanChange}
            >
              {enhancedPlans.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedPlanId === plan.name 
                      ? 'border-indigo-400 bg-indigo-50 shadow-md transform -translate-y-1' 
                      : plan.isRecommended 
                        ? 'border-primary/50 bg-primary/5 hover:border-indigo-300 hover:bg-indigo-50/50' 
                        : 'border-border hover:border-indigo-200 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={plan.name} id={plan.name} className={selectedPlanId === plan.name ? 'text-indigo-600' : ''} />
                    <Label htmlFor={plan.name} className="flex items-center space-x-2">
                      <span className={`font-medium ${selectedPlanId === plan.name ? 'text-indigo-700' : ''}`}>{plan.name}</span>
                      {plan.isRecommended && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Recommended
                        </Badge>
                      )}
                    </Label>
                  </div>
                  
                  <div className="ml-6 mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base plan ({plan.minutesPerMonth.toLocaleString()} minutes):</span>
                      <span className="font-medium">
                        {getCurrencySymbol(currency)}{getCurrencyConversion(billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toFixed(2)} per {billingType === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {plan.overageMinutes > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Overage ({plan.overageMinutes.toLocaleString()} minutes at {getCurrencySymbol(currency)}{getCurrencyConversion(0.13).toFixed(2)}/min):</span>
                        <span className="font-medium">{getCurrencySymbol(currency)}{getCurrencyConversion(plan.overageCost).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-medium pt-1 border-t border-border">
                      <span>Total monthly cost:</span>
                      <span className={`${selectedPlanId === plan.name ? 'text-indigo-600 font-bold' : 'text-primary'}`}>
                        {getCurrencySymbol(currency)}{getCurrencyConversion(plan.totalCost).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>Effective cost per minute:</span>
                      <span>{getCurrencySymbol(currency)}{getCurrencyConversion(plan.costPerMinute).toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">
                Based on your usage: <span className="font-medium">{totalMinutes.toLocaleString()} minutes/month</span>
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(SYNTHFLOW_PRICING_URL, '_blank')}
              className="w-full sm:w-auto flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Pricing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
