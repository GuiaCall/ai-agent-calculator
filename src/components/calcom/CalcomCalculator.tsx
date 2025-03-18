
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalcomPlan } from "@/types/calcom";
import { useTranslation } from "react-i18next";
import { useCalcomCalculator } from "./hooks/useCalcomCalculator";
import { CalcomHeader } from "./CalcomHeader";
import { CalcomPlanSelector } from "./CalcomPlanSelector";
import { CalcomUsersInput } from "./CalcomUsersInput";
import { CalcomCostSummary } from "./CalcomCostSummary";

interface CalcomCalculatorProps {
  onPlanSelect: (plan: CalcomPlan, numberOfUsers: number) => void;
  totalMinutes: number;
  margin?: number;
  numberOfUsers?: number;
}

export function CalcomCalculator({ 
  onPlanSelect, 
  totalMinutes, 
  margin = 20, 
  numberOfUsers: initialUsers = 1 
}: CalcomCalculatorProps) {
  const { t } = useTranslation();
  
  const {
    selectedPlan,
    setSelectedPlan,
    numberOfUsers,
    setNumberOfUsers,
    monthlyTotal,
    computeMonthlyCost,
    getCurrencyConversion,
    getCurrencySymbol
  } = useCalcomCalculator({
    totalMinutes,
    onPlanSelect,
    margin,
    initialUsers
  });

  const handlePlanChange = (plan: CalcomPlan) => {
    setSelectedPlan(plan);
    if (!plan.allowsTeam) {
      setNumberOfUsers(1);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <CalcomHeader />

      <CalcomPlanSelector
        selectedPlan={selectedPlan}
        onPlanChange={handlePlanChange}
        getCurrencySymbol={getCurrencySymbol}
        getCurrencyConversion={getCurrencyConversion}
      />

      <CalcomUsersInput
        selectedPlan={selectedPlan}
        numberOfUsers={numberOfUsers}
        onUserCountChange={setNumberOfUsers}
        getCurrencySymbol={getCurrencySymbol}
        getCurrencyConversion={getCurrencyConversion}
      />

      <div className="flex justify-between items-center pt-4">
        <Button 
          onClick={() => computeMonthlyCost(selectedPlan, numberOfUsers, true)}
          className="w-full"
          variant="default"
        >
          {t("computeMonthlyCost")}
        </Button>
      </div>

      <CalcomCostSummary
        selectedPlan={selectedPlan}
        numberOfUsers={numberOfUsers}
        monthlyTotal={monthlyTotal}
        totalMinutes={totalMinutes}
        getCurrencySymbol={getCurrencySymbol}
        getCurrencyConversion={getCurrencyConversion}
      />
    </Card>
  );
}
