
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CALCOM_PLANS, CALCOM_PRICING_URL } from "@/constants/calcomPlans";
import { CalcomPlan } from "@/types/calcom";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Calendar } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      default:
        return amount;
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
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
        title: t("error"),
        description: t("pleaseSelectPlan"),
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
      title: t("monthlyCostCalculated"),
      description: `${t("basePlanCost")}: ${getCurrencySymbol(currency)}${getCurrencyConversion(selectedPlan.basePrice).toFixed(2)}
${t("teamMembersCost")}: ${getCurrencySymbol(currency)}${getCurrencyConversion(teamMemberCost).toFixed(2)}
${t("totalMonthlyCost")}: ${getCurrencySymbol(currency)}${getCurrencyConversion(totalCost).toFixed(2)}`,
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          {t("calcomCalculator")}
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(CALCOM_PRICING_URL, '_blank')}
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
        >
          {t("viewCalcomPricing")} <ExternalLink className="h-3 w-3 ml-1" />
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
              {plan.name} ({getCurrencySymbol(currency)}{getCurrencyConversion(plan.basePrice).toFixed(2)}/{t("month")})
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPlan?.name === "Team" || selectedPlan?.name === "Organization" ? (
        <div className="space-y-2">
          <Label htmlFor="numberOfUsers">{t("numberOfTeamMembers")}</Label>
          <Input
            id="numberOfUsers"
            type="number"
            min="0"
            value={numberOfUsers}
            onChange={(e) => setNumberOfUsers(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <p className="text-sm text-muted-foreground">
            {t("teamMembersCostInfo", { cost: `${getCurrencySymbol(currency)}${getCurrencyConversion(12).toFixed(2)}` })}
          </p>
        </div>
      ) : null}

      <div className="flex justify-between items-center pt-4">
        <Button 
          onClick={computeMonthlyCost}
          className="w-full"
          variant="outline"
        >
          {t("computeMonthlyCost")}
        </Button>
      </div>

      {monthlyTotal > 0 && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg space-y-2">
          <p className="text-sm font-medium">
            {t("setupCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(selectedPlan?.basePrice + (selectedPlan?.allowsTeam ? numberOfUsers * selectedPlan.pricePerUser : 0)).toFixed(2)}
          </p>
          <p className="text-sm font-medium">
            {t("monthlyCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(monthlyTotal).toFixed(2)}
          </p>
        </div>
      )}
    </Card>
  );
}
