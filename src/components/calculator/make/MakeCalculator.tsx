import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MakePlan, MakeRecommendedPlan, OperationsCalculation } from "@/types/make";
import { MakeCalculatorHeader } from "./MakeCalculatorHeader";
import { MakeOperationsInput } from "./MakeOperationsInput";
import { MakeBillingCycleSelector } from "./MakeBillingCycleSelector";
import { MakeCalculationResults } from "./MakeCalculationResults";
import { calculateMakeOperations, calculateRequiredPlanPrice } from "@/utils/makeCalculations";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { useTranslation } from "react-i18next";
import { Technology } from "@/types/invoice";

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
  const { setTechnologies } = useCalculatorStateContext();
  const { t } = useTranslation();

  const calculateOperations = () => {
    const { totalCalls, totalOperations } = calculateMakeOperations(
      totalMinutes,
      averageCallDuration,
      operationsPerScenario
    );
    
    const { 
      totalPrice, 
      monthlyEquivalent,
      operationsIncluded,
      costPerMinute,
      recommendations: planRecommendations,
      recommendedPlan: optimalPlan
    } = calculateRequiredPlanPrice(
      totalOperations,
      selectedPlanType,
      totalMinutes
    );

    const monthlyPriceEquivalent = optimalPlan.monthlyEquivalent;

    const adaptedPlan: MakePlan = {
      name: optimalPlan.name,
      operationsPerMonth: optimalPlan.operationsPerMonth,
      monthlyPrice: monthlyPriceEquivalent,
      yearlyPrice: selectedPlanType === 'yearly' 
        ? optimalPlan.price 
        : optimalPlan.price * 12
    };

    setCalculation({
      totalCalls,
      operationsPerScenario,
      totalOperations,
      recommendedPlan: adaptedPlan
    });

    setRecommendations(planRecommendations);
    setRecommendedPlan(optimalPlan);
    setSelectedPlan(optimalPlan);

    onPlanSelect(adaptedPlan);
    onCostPerMinuteChange(costPerMinute);
    
    setTechnologies((prevTechs: Technology[]) => 
      prevTechs.map(tech => 
        tech.id === 'make' ? { ...tech, costPerMinute: monthlyPriceEquivalent } : tech
      )
    );
  };

  const handlePlanSelect = (plan: MakeRecommendedPlan) => {
    setSelectedPlan(plan);
    
    const monthlyPriceEquivalent = plan.monthlyEquivalent;
    
    const adaptedPlan: MakePlan = {
      name: plan.name,
      operationsPerMonth: plan.operationsPerMonth,
      monthlyPrice: monthlyPriceEquivalent,
      yearlyPrice: selectedPlanType === 'yearly' ? plan.price : plan.price * 12
    };

    const costPerMinute = totalMinutes > 0 ? monthlyPriceEquivalent / totalMinutes : 0;
    
    onPlanSelect(adaptedPlan);
    onCostPerMinuteChange(costPerMinute);
    
    setTechnologies((prevTechs: Technology[]) => 
      prevTechs.map(tech => 
        tech.id === 'make' ? { ...tech, costPerMinute: monthlyPriceEquivalent } : tech
      )
    );
  };

  const handleBillingTypeChange = (value: string) => {
    setSelectedPlanType(value);
    
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
          {t("calculateOperations")}
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

