
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MakePlan, MakeRecommendedPlan, OperationsCalculation } from "@/types/make";
import { MakeCalculatorHeader } from "./MakeCalculatorHeader";
import { MakeOperationsInput } from "./MakeOperationsInput";
import { MakeBillingCycleSelector } from "./MakeBillingCycleSelector";
import { MakeCalculationResults } from "./MakeCalculationResults";
import { MakePlanSelector } from "./MakePlanSelector";
import { calculateMakeOperations, calculateRequiredPlanPrice } from "@/utils/makeCalculations";

export function MakeCalculator({
  totalMinutes,
  averageCallDuration,
  onPlanSelect,
  onCostPerMinuteChange,
}: {
  totalMinutes: number;
  averageCallDuration: number;
  onPlanSelect: (plan: MakePlan) => void;
  onCostPerMinuteChange: (cost: number) => void;
}) {
  const [operationsPerScenario, setOperationsPerScenario] = useState<number>(100);
  const [selectedPlanType, setSelectedPlanType] = useState<string>("monthly");
  const [calculation, setCalculation] = useState<OperationsCalculation | null>(null);
  const [recommendations, setRecommendations] = useState<MakeRecommendedPlan[]>([]);
  const [recommendedPlan, setRecommendedPlan] = useState<MakeRecommendedPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MakeRecommendedPlan | null>(null);

  const calculateOperations = () => {
    const { totalCalls, totalOperations } = calculateMakeOperations(
      totalMinutes,
      averageCallDuration,
      operationsPerScenario
    );
    
    const { 
      totalPrice, 
      operationsIncluded,
      costPerMinute,
      recommendations: planRecommendations,
      recommendedPlan: optimalPlan
    } = calculateRequiredPlanPrice(
      totalOperations,
      selectedPlanType,
      totalMinutes
    );

    // Create adapter for legacy MakePlan format
    const adaptedPlan: MakePlan = {
      name: optimalPlan.name,
      operationsPerMonth: optimalPlan.operationsPerMonth,
      monthlyPrice: selectedPlanType === 'monthly' ? optimalPlan.price : optimalPlan.price,
      yearlyPrice: selectedPlanType === 'yearly' ? optimalPlan.price : optimalPlan.price
    };

    setCalculation({
      totalCalls,
      operationsPerScenario,
      totalOperations,
      recommendedPlan: adaptedPlan
    });

    setRecommendations(planRecommendations);
    setRecommendedPlan(optimalPlan);
    setSelectedPlan(optimalPlan); // Set the recommended plan as the initial selected plan

    onPlanSelect(adaptedPlan);
    onCostPerMinuteChange(costPerMinute);
  };

  const handlePlanSelect = (plan: MakeRecommendedPlan) => {
    setSelectedPlan(plan);
    
    // Create adapter for legacy MakePlan format
    const adaptedPlan: MakePlan = {
      name: plan.name,
      operationsPerMonth: plan.operationsPerMonth,
      monthlyPrice: selectedPlanType === 'monthly' ? plan.price : plan.price,
      yearlyPrice: selectedPlanType === 'yearly' ? plan.price : plan.price
    };

    // Calculate cost per minute based on the selected plan
    const costPerMinute = totalMinutes > 0 ? plan.price / totalMinutes : 0;
    
    onPlanSelect(adaptedPlan);
    onCostPerMinuteChange(costPerMinute);
  };

  const handleBillingTypeChange = (value: string) => {
    setSelectedPlanType(value);
    
    // Recalculate if we already have operations calculated
    if (calculation) {
      calculateOperations();
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <MakeCalculatorHeader />
      
      <div className="space-y-4">
        <MakeOperationsInput 
          operationsPerScenario={operationsPerScenario}
          setOperationsPerScenario={setOperationsPerScenario}
        />

        <MakeBillingCycleSelector
          selectedPlanType={selectedPlanType}
          onBillingTypeChange={handleBillingTypeChange}
        />

        <button 
          onClick={calculateOperations} 
          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Calculate Required Operations
        </button>

        {calculation && (
          <MakeCalculationResults 
            calculation={calculation}
            recommendations={recommendations}
            recommendedPlan={recommendedPlan}
            selectedPlan={selectedPlan}
            selectedPlanType={selectedPlanType}
            onPlanSelect={handlePlanSelect}
          />
        )}
      </div>
    </Card>
  );
}
