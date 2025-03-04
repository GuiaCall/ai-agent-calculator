
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CALCOM_PLANS, CALCOM_PRICING_URL } from "@/constants/calcomPlans";
import { CalcomPlan } from "@/types/calcom";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

interface CalcomCalculatorProps {
  onPlanSelect: (plan: CalcomPlan, numberOfUsers: number) => void;
  totalMinutes: number;
  margin?: number;
}

export function CalcomCalculator({ onPlanSelect, totalMinutes, margin = 20 }: CalcomCalculatorProps) {
  const [selectedPlan, setSelectedPlan] = useState<CalcomPlan | null>(null);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(1);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const { toast } = useToast();
  const { currency } = useCalculatorStateContext();

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

  useEffect(() => {
    if (selectedPlan && totalMinutes > 0) {
      const teamMemberCost = (selectedPlan.name === "Team" || selectedPlan.name === "Organization") && numberOfUsers > 0
        ? numberOfUsers * selectedPlan.pricePerUser
        : 0;
      
      const totalCost = selectedPlan.basePrice + teamMemberCost;
      setMonthlyTotal(totalCost);

      const costPerMinute = totalMinutes > 0 ? Number((totalCost / totalMinutes).toFixed(3)) : 0;
      const updatedPlan = {
        ...selectedPlan,
        costPerMinute
      };
      onPlanSelect(updatedPlan, numberOfUsers);
    }
  }, [selectedPlan, numberOfUsers, totalMinutes, onPlanSelect]);

  const computeMonthlyCost = () => {
    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a plan first",
        variant: "destructive",
      });
      return;
    }

    const teamMemberCost = (selectedPlan.name === "Team" || selectedPlan.name === "Organization") && numberOfUsers > 0
      ? numberOfUsers * selectedPlan.pricePerUser
      : 0;
    
    const totalCost = selectedPlan.basePrice + teamMemberCost;
    setMonthlyTotal(totalCost);
    
    const costPerMinute = totalMinutes > 0 ? Number((totalCost / totalMinutes).toFixed(3)) : 0;
    const updatedPlan = {
      ...selectedPlan,
      costPerMinute
    };
    onPlanSelect(updatedPlan, numberOfUsers);
    
    toast({
      title: "Monthly Cost Calculated",
      description: `Base Plan Cost: ${getCurrencySymbol(currency)}${getCurrencyConversion(selectedPlan.basePrice).toFixed(2)}
Team Members Cost: ${getCurrencySymbol(currency)}${getCurrencyConversion(teamMemberCost).toFixed(2)}
Total Monthly Cost: ${getCurrencySymbol(currency)}${getCurrencyConversion(totalCost).toFixed(2)}`,
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cal.com Plan</h3>
        <Button variant="ghost" size="sm" onClick={() => window.open(CALCOM_PRICING_URL, '_blank')}>
          View Pricing <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <RadioGroup
        onValueChange={(value) => {
          const plan = CALCOM_PLANS.find(p => p.name === value);
          if (plan) {
            setSelectedPlan(plan);
            if (!plan.allowsTeam) {
              setNumberOfUsers(1);
            }
          }
        }}
      >
        {CALCOM_PLANS.map((plan) => (
          <div key={plan.name} className="flex items-center space-x-2">
            <RadioGroupItem value={plan.name} id={`calcom-${plan.name}`} />
            <Label htmlFor={`calcom-${plan.name}`}>
              {plan.name} ({getCurrencySymbol(currency)}{getCurrencyConversion(plan.basePrice).toFixed(2)}/month)
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPlan?.name === "Team" || selectedPlan?.name === "Organization" ? (
        <div className="space-y-2">
          <Label htmlFor="numberOfUsers">Number of Team Members</Label>
          <Input
            id="numberOfUsers"
            type="number"
            min="0"
            value={numberOfUsers}
            onChange={(e) => setNumberOfUsers(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <p className="text-sm text-muted-foreground">
            Team members cost {getCurrencySymbol(currency)}{getCurrencyConversion(12).toFixed(2)}/month each
          </p>
        </div>
      ) : null}

      <div className="flex justify-between items-center pt-4">
        <Button 
          onClick={computeMonthlyCost}
          className="w-full"
          variant="outline"
        >
          Compute Monthly Cost
        </Button>
      </div>

      {monthlyTotal > 0 && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg space-y-2">
          <p className="text-sm font-medium">
            Setup Cost: {getCurrencySymbol(currency)}{getCurrencyConversion(selectedPlan?.basePrice + (selectedPlan?.allowsTeam ? numberOfUsers * selectedPlan.pricePerUser : 0)).toFixed(2)}
          </p>
          <p className="text-sm font-medium">
            Monthly Cost: {getCurrencySymbol(currency)}{getCurrencyConversion(monthlyTotal).toFixed(2)}
          </p>
        </div>
      )}
    </Card>
  );
}
