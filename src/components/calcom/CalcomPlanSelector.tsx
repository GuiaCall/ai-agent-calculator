
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CALCOM_PLANS } from "@/constants/calcomPlans";
import { CalcomPlan } from "@/types/calcom";
import { useTranslation } from "react-i18next";

interface CalcomPlanSelectorProps {
  selectedPlan: CalcomPlan | null;
  onPlanChange: (plan: CalcomPlan) => void;
  getCurrencySymbol: (currency?: string) => string;
  getCurrencyConversion: (amount: number) => number;
}

export function CalcomPlanSelector({
  selectedPlan,
  onPlanChange,
  getCurrencySymbol,
  getCurrencyConversion
}: CalcomPlanSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="border rounded-md p-4 bg-background/50">
      <RadioGroup
        defaultValue={CALCOM_PLANS[0].name}
        onValueChange={(value) => {
          const plan = CALCOM_PLANS.find(p => p.name === value);
          if (plan) {
            onPlanChange(plan);
          }
        }}
        className="space-y-2"
      >
        {CALCOM_PLANS.map((plan) => (
          <div key={plan.name} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
            <RadioGroupItem value={plan.name} id={`calcom-${plan.name}`} />
            <Label htmlFor={`calcom-${plan.name}`} className="flex-1 cursor-pointer">
              {plan.name} ({getCurrencySymbol()}{getCurrencyConversion(plan.basePrice).toFixed(2)}/{t("month")})
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
