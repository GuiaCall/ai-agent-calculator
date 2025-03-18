
import { useState, useEffect } from "react";
import { SynthflowPlan } from "@/types/synthflow";
import { SYNTHFLOW_PLANS, SYNTHFLOW_PRICING_URL } from "@/constants/synthflowPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalculatorStateContext } from "../calculator/CalculatorStateContext";
import { useTranslation } from "react-i18next";
import { SynthflowBillingToggle } from "./SynthflowBillingToggle";
import { SynthflowPlanSelector } from "./SynthflowPlanSelector";
import { SynthflowUsageSummary } from "./SynthflowUsageSummary";
import { useSynthflowPlans } from "./hooks/useSynthflowPlans";

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
  const { setTechnologies } = useCalculatorStateContext();
  const { t } = useTranslation();
  
  const { 
    enhancedPlans, 
    recommendedPlan,
    getCurrencySymbol,
    getCurrencyConversion
  } = useSynthflowPlans(totalMinutes, billingType);

  useEffect(() => {
    if (!selectedPlanId && recommendedPlan) {
      setSelectedPlanId(recommendedPlan.name);
      
      const selectedPlanWithCost = {
        ...recommendedPlan,
        costPerMinute: recommendedPlan.costPerMinute
      };
      
      onPlanSelect(selectedPlanWithCost);
      
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'synthflow' ? { ...tech, costPerMinute: recommendedPlan.totalCost ?? recommendedPlan.monthlyPrice } : tech
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
      
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'synthflow' ? { ...tech, costPerMinute: selectedPlan.totalCost ?? selectedPlan.monthlyPrice } : tech
        )
      );
    }
  };

  const toggleBillingType = () => {
    const newBillingType = billingType === 'monthly' ? 'yearly' : 'monthly';
    setBillingType(newBillingType);
    setSelectedPlanId(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-indigo-800 font-bold text-xl flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          Synthflow Calculator
        </CardTitle>
        
        <SynthflowBillingToggle 
          billingType={billingType} 
          onToggle={toggleBillingType} 
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <SynthflowPlanSelector
            enhancedPlans={enhancedPlans}
            selectedPlanId={selectedPlanId}
            onPlanChange={handlePlanChange}
            billingType={billingType}
            getCurrencySymbol={getCurrencySymbol}
            getCurrencyConversion={getCurrencyConversion}
          />
          
          <SynthflowUsageSummary 
            totalMinutes={totalMinutes}
            t={t}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("basedOnUsage")}: <span className="font-medium">{totalMinutes.toLocaleString()} {t("minutesPerMonth")}</span>
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(SYNTHFLOW_PRICING_URL, '_blank')}
              className="w-full sm:w-auto flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              {t("viewPricing")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
