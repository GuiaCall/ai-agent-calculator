
import { useState, useEffect } from "react";
import { SynthflowPlan } from "@/types/synthflow";
import { SYNTHFLOW_PLANS, SYNTHFLOW_PRICING_URL } from "@/constants/synthflowPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateSynthflowCost } from "@/utils/synthflowCalculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
    }
  }, [recommendedPlan, selectedPlanId, onPlanSelect]);

  const handlePlanChange = (planName: string) => {
    setSelectedPlanId(planName);
    
    const selectedPlan = enhancedPlans.find(p => p.name === planName);
    if (selectedPlan) {
      onPlanSelect({
        ...selectedPlan,
        costPerMinute: selectedPlan.costPerMinute
      });
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
        <CardTitle>Synthflow Plan Calculator</CardTitle>
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
            <Label>Select a Plan</Label>
            <RadioGroup 
              className="grid gap-4 mt-3"
              value={selectedPlanId || ''}
              onValueChange={handlePlanChange}
            >
              {enhancedPlans.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`p-4 rounded-lg border ${
                    plan.isRecommended ? 'border-primary/50 bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={plan.name} id={plan.name} />
                    <Label htmlFor={plan.name} className="flex items-center space-x-2">
                      <span className="font-medium">{plan.name}</span>
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
                        ${billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice} per {billingType === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {plan.overageMinutes > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Overage ({plan.overageMinutes.toLocaleString()} minutes at $0.13/min):</span>
                        <span className="font-medium">${plan.overageCost.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-medium pt-1 border-t border-border">
                      <span>Total {billingType === 'monthly' ? 'monthly' : 'yearly'} cost:</span>
                      <span className="text-primary">${plan.totalCost.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>Effective cost per minute:</span>
                      <span>${plan.costPerMinute.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">
                Based on your usage: <span className="font-medium">{totalMinutes.toLocaleString()} minutes/month</span>
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(SYNTHFLOW_PRICING_URL, '_blank')}
              className="flex items-center gap-1"
            >
              View Pricing <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
