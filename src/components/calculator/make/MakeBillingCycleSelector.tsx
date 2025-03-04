
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MakeBillingCycleSelectorProps {
  selectedPlanType: string;
  onBillingTypeChange: (value: string) => void;
}

export function MakeBillingCycleSelector({
  selectedPlanType,
  onBillingTypeChange,
}: MakeBillingCycleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Billing Cycle</Label>
      <Select
        value={selectedPlanType}
        onValueChange={onBillingTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select billing cycle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly (Save up to 15%)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
