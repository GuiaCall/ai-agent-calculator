
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SynthflowPlan } from "@/types/synthflow";
import { useTranslation } from "react-i18next";
import { useSynthflowPlans } from "./hooks/useSynthflowPlans";
import { SynthflowPlanSelector } from "./SynthflowPlanSelector";
import { SynthflowBillingToggle } from "./SynthflowBillingToggle";
import { SynthflowUsageSummary } from "./SynthflowUsageSummary";
import { useCalculatorStateContext } from "../calculator/CalculatorStateContext";

export interface SynthflowCalculatorProps {
  totalMinutes: number;
  onPlanSelect: (plan: SynthflowPlan | null) => void;
}

export function SynthflowCalculator({ totalMinutes, onPlanSelect }: SynthflowCalculatorProps) {
  const { t } = useTranslation();
  const { currency } = useCalculatorStateContext();
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Get enhanced plans from the hook
  const { enhancedPlans, recommendedPlan, getCurrencySymbol, getCurrencyConversion } = useSynthflowPlans(totalMinutes, billingType);

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    
    // Find the selected plan by ID
    const selectedPlan = enhancedPlans.find(plan => plan.name === planId) || null;
    onPlanSelect(selectedPlan);
  };

  const handleBillingToggle = () => {
    setBillingType(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    // Reset selected plan when toggling billing type
    setSelectedPlanId(null);
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
            enhancedPlans={enhancedPlans}
            selectedPlanId={selectedPlanId}
            onPlanChange={handlePlanChange}
            billingType={billingType}
            getCurrencySymbol={getCurrencySymbol}
            getCurrencyConversion={getCurrencyConversion}
          />

          {selectedPlanId && (
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
