
import { CalcomPlan } from "@/types/calcom";
import { useTranslation } from "react-i18next";

interface CalcomCostSummaryProps {
  selectedPlan: CalcomPlan | null;
  numberOfUsers: number;
  monthlyTotal: number;
  totalMinutes: number;
  getCurrencySymbol: () => string;
  getCurrencyConversion: (amount: number) => number;
}

export function CalcomCostSummary({
  selectedPlan,
  numberOfUsers,
  monthlyTotal,
  totalMinutes,
  getCurrencySymbol,
  getCurrencyConversion
}: CalcomCostSummaryProps) {
  const { t } = useTranslation();

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-primary/10 rounded-lg space-y-2">
      <p className="text-sm font-medium">
        {t("basePlanCost")}: {getCurrencySymbol()}{getCurrencyConversion(selectedPlan.basePrice).toFixed(2)}
      </p>
      {selectedPlan.allowsTeam && numberOfUsers > 0 && (
        <p className="text-sm font-medium">
          {t("teamMembersCost")} ({numberOfUsers}): {getCurrencySymbol()}{getCurrencyConversion(numberOfUsers * (selectedPlan.pricePerUser || 0)).toFixed(2)}
        </p>
      )}
      <p className="text-sm font-medium text-primary">
        {t("totalCost")}: {getCurrencySymbol()}{getCurrencyConversion(monthlyTotal).toFixed(2)}
      </p>
      {totalMinutes > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {t("costPerMinute")}: {getCurrencySymbol()}{getCurrencyConversion(monthlyTotal / totalMinutes).toFixed(5)}
        </p>
      )}
    </div>
  );
}
