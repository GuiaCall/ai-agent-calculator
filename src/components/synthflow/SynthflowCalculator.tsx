
import React, { useState, useEffect } from 'react';
import { useSynthflowPlans } from './hooks/useSynthflowPlans';
import { SynthflowPlanSelector } from './SynthflowPlanSelector';
import { SynthflowBillingToggle } from './SynthflowBillingToggle';
import { SynthflowUsageSummary } from './SynthflowUsageSummary';
import { useTranslation } from 'react-i18next';
import { SynthflowPlan } from '@/types/synthflow';

interface SynthflowCalculatorProps {
  totalMinutes: number;
  onPlanSelect: (plan: SynthflowPlan | null) => void;
}

export function SynthflowCalculator({ totalMinutes, onPlanSelect }: SynthflowCalculatorProps) {
  const { t } = useTranslation();
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SynthflowPlan | null>(null);
  
  // Use the hook to get synthflow plans
  const { enhancedPlans, recommendedPlan } = useSynthflowPlans(totalMinutes, billingType);

  // Initialize with the recommended plan if none is selected
  useEffect(() => {
    if (!selectedPlan && recommendedPlan) {
      handlePlanSelect(recommendedPlan);
    }
  }, [recommendedPlan]);

  // Handle plan selection
  const handlePlanSelect = (plan: SynthflowPlan | null) => {
    setSelectedPlan(plan);
    onPlanSelect(plan);
  };

  // Handle billing type change
  const handleBillingTypeChange = (type: 'monthly' | 'yearly') => {
    setBillingType(type);
  };

  return (
    <div className="space-y-6">
      <SynthflowBillingToggle 
        billingType={billingType} 
        onToggle={() => handleBillingTypeChange(billingType === 'monthly' ? 'yearly' : 'monthly')} 
      />
      
      <SynthflowPlanSelector 
        enhancedPlans={enhancedPlans}
        selectedPlan={selectedPlan}
        onPlanSelect={handlePlanSelect}
        billingType={billingType}
        recommendedPlan={recommendedPlan}
      />
      
      <SynthflowUsageSummary 
        totalMinutes={totalMinutes}
      />
    </div>
  );
}
