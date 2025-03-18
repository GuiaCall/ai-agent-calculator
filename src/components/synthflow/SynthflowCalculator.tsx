
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SynthflowPlan } from "@/types/synthflow";
import { useTranslation } from "react-i18next";
import { useSynthflowPlans } from "./hooks/useSynthflowPlans";
import { SynthflowPlanSelector } from "./SynthflowPlanSelector";
import { SynthflowBillingToggle } from "./SynthflowBillingToggle";
import { SynthflowUsageSummary } from "./SynthflowUsageSummary";

export interface SynthflowCalculatorProps {
  totalMinutes: number;
  onPlanSelect: (plan: SynthflowPlan | null) => void;
}

export function SynthflowCalculator({ totalMinutes, onPlanSelect }: SynthflowCalculatorProps) {
  const { t } = useTranslation();
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const { plans, selectedPlan, setSelectedPlan } = useSynthflowPlans(billingType, totalMinutes);

  const handlePlanSelect = (plan: SynthflowPlan | null) => {
    setSelectedPlan(plan);
    onPlanSelect(plan);
  };

  const handleBillingToggle = () => {
    setBillingType(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    // Reset selected plan when toggling billing type
    setSelectedPlan(null);
    onPlanSelect(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t("synthflowPlans")}</h3>
            <SynthflowBillingToggle 
              billingType={billingType} 
              onToggle={handleBillingToggle}
            />
          </div>

          <SynthflowPlanSelector
            plans={plans}
            selectedPlan={selectedPlan}
            onPlanSelect={handlePlanSelect}
            billingType={billingType}
          />

          {selectedPlan && (
            <SynthflowUsageSummary 
              totalMinutes={totalMinutes}
              t={t}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
