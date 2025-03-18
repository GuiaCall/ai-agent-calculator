
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SynthflowPlan } from "@/types/synthflow";
import { useTranslation } from "react-i18next";

interface SynthflowPlanSelectorProps {
  enhancedPlans: SynthflowPlan[];
  selectedPlanId: string | null;
  onPlanChange: (planName: string) => void;
  billingType: 'monthly' | 'yearly';
  getCurrencySymbol: (currency: string) => string;
  getCurrencyConversion: (amount: number) => number;
}

export function SynthflowPlanSelector({
  enhancedPlans,
  selectedPlanId,
  onPlanChange,
  billingType,
  getCurrencySymbol,
  getCurrencyConversion
}: SynthflowPlanSelectorProps) {
  const { t } = useTranslation();
  const { currency } = { currency: 'USD' }; // Temporary default, will be replaced by context
  
  return (
    <div>
      <Label className="text-base font-medium">{t("selectPlan")}</Label>
      <RadioGroup 
        className="grid gap-4 mt-3"
        value={selectedPlanId || ''}
        onValueChange={onPlanChange}
      >
        {enhancedPlans.map((plan) => (
          <div 
            key={plan.name} 
            className={`p-4 rounded-lg border transition-all duration-200 ${
              selectedPlanId === plan.name 
                ? 'border-indigo-400 bg-indigo-50 shadow-md transform -translate-y-1' 
                : plan.isRecommended 
                  ? 'border-primary/50 bg-primary/5 hover:border-indigo-300 hover:bg-indigo-50/50' 
                  : 'border-border hover:border-indigo-200 hover:bg-indigo-50/30'
            }`}
          >
            <PlanHeader 
              plan={plan} 
              selectedPlanId={selectedPlanId} 
            />
            
            <PlanDetails 
              plan={plan}
              selectedPlanId={selectedPlanId}
              billingType={billingType}
              getCurrencySymbol={getCurrencySymbol}
              getCurrencyConversion={getCurrencyConversion}
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function PlanHeader({ plan, selectedPlanId }: { plan: SynthflowPlan, selectedPlanId: string | null }) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={plan.name} id={plan.name} className={selectedPlanId === plan.name ? 'text-indigo-600' : ''} />
      <Label htmlFor={plan.name} className="flex items-center space-x-2">
        <span className={`font-medium ${selectedPlanId === plan.name ? 'text-indigo-700' : ''}`}>{plan.name}</span>
        {plan.isRecommended && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {t("recommendedPlan")}
          </Badge>
        )}
      </Label>
    </div>
  );
}

function PlanDetails({ 
  plan, 
  selectedPlanId, 
  billingType,
  getCurrencySymbol,
  getCurrencyConversion
}: { 
  plan: SynthflowPlan, 
  selectedPlanId: string | null,
  billingType: 'monthly' | 'yearly',
  getCurrencySymbol: (currency: string) => string,
  getCurrencyConversion: (amount: number) => number
}) {
  const { t } = useTranslation();
  const { currency } = { currency: 'USD' }; // Temporary default, will be replaced by context
  
  return (
    <div className="ml-6 mt-2 space-y-2 text-sm">
      <div className="flex justify-between">
        <span>{t("basePlan", { count: plan.minutesPerMonth })}</span>
        <span className="font-medium">
          {getCurrencySymbol(currency)}{getCurrencyConversion(billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toFixed(2)} {t("per")} {billingType === 'monthly' ? t("month") : t("year")}
        </span>
      </div>
      
      {(plan.overageMinutes || 0) > 0 && (
        <div className="flex justify-between text-amber-700">
          <span>{t("overage", { count: plan.overageMinutes, rate: `${getCurrencySymbol(currency)}${getCurrencyConversion(0.13).toFixed(2)}` })}</span>
          <span className="font-medium">{getCurrencySymbol(currency)}{getCurrencyConversion(plan.overageCost || 0).toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between font-medium pt-1 border-t border-border">
        <span>{t("totalMonthlyCost")}</span>
        <span className={`${selectedPlanId === plan.name ? 'text-indigo-600 font-bold' : 'text-primary'}`}>
          {getCurrencySymbol(currency)}{getCurrencyConversion(plan.totalCost || 0).toFixed(2)}
        </span>
      </div>
      
      <div className="flex justify-between text-muted-foreground">
        <span>{t("effectiveCostPerMinute")}</span>
        <span>{getCurrencySymbol(currency)}{getCurrencyConversion(plan.costPerMinute || 0).toFixed(4)}</span>
      </div>
    </div>
  );
}
