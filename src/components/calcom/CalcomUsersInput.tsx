
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalcomPlan } from "@/types/calcom";
import { useTranslation } from "react-i18next";

interface CalcomUsersInputProps {
  selectedPlan: CalcomPlan | null;
  numberOfUsers: number;
  onUserCountChange: (count: number) => void;
  getCurrencySymbol: () => string;
  getCurrencyConversion: (amount: number) => number;
}

export function CalcomUsersInput({
  selectedPlan,
  numberOfUsers,
  onUserCountChange,
  getCurrencySymbol,
  getCurrencyConversion
}: CalcomUsersInputProps) {
  const { t } = useTranslation();

  if (!selectedPlan || (selectedPlan.name !== "Team" && selectedPlan.name !== "Organization")) {
    return null;
  }

  return (
    <div className="space-y-2 border rounded-md p-4 bg-background/50">
      <Label htmlFor="numberOfUsers">{t("numberOfTeamMembers")}</Label>
      <Input
        id="numberOfUsers"
        type="number"
        min="1"
        value={numberOfUsers}
        onChange={(e) => onUserCountChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-full"
      />
      <p className="text-sm text-muted-foreground mt-1">
        {t("teamMembersCostInfo", { cost: `${getCurrencySymbol()}${getCurrencyConversion(selectedPlan.pricePerUser).toFixed(2)}` })}
      </p>
    </div>
  );
}
