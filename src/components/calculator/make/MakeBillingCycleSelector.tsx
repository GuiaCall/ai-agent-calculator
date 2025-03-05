
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface MakeBillingCycleSelectorProps {
  selectedPlanType: string;
  onBillingTypeChange: (value: string) => void;
}

export function MakeBillingCycleSelector({
  selectedPlanType,
  onBillingTypeChange,
}: MakeBillingCycleSelectorProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <Label>{t("billingCycle")}</Label>
      <Select
        value={selectedPlanType}
        onValueChange={onBillingTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("billingCycle")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly">{t("monthlyBilling")}</SelectItem>
          <SelectItem value="yearly">{t("yearlyBilling")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
