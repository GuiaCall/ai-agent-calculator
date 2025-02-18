
import { useEffect } from "react";
import { SynthflowPlan } from "@/types/synthflow";
import { SYNTHFLOW_PLANS } from "@/constants/synthflowPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateSynthflowCost } from "@/utils/synthflowCalculations";

interface SynthflowCalculatorProps {
  totalMinutes: number;
  onPlanSelect: (plan: SynthflowPlan | null) => void;
}

export function SynthflowCalculator({
  totalMinutes,
  onPlanSelect,
}: SynthflowCalculatorProps) {
  useEffect(() => {
    if (totalMinutes > 0) {
      // Find most suitable plan based on minutes
      let selectedPlan: SynthflowPlan | null = null;
      
      if (totalMinutes <= 2000) {
        selectedPlan = SYNTHFLOW_PLANS[0]; // Starter
      } else if (totalMinutes <= 4000) {
        selectedPlan = SYNTHFLOW_PLANS[1]; // Pro
      } else {
        selectedPlan = SYNTHFLOW_PLANS[2]; // Agency
      }
      
      // Calculate cost including overage if applicable
      const cost = calculateSynthflowCost(totalMinutes, selectedPlan);
      const costPerMinute = cost / totalMinutes;
      
      // Update the selected plan with calculated cost per minute
      if (selectedPlan) {
        onPlanSelect({
          ...selectedPlan,
          costPerMinute: costPerMinute
        });
      }
    }
  }, [totalMinutes, onPlanSelect]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Synthflow Plan Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label>Recommended Plan Based on Minutes</Label>
          <RadioGroup 
            className="grid gap-4"
            defaultValue={SYNTHFLOW_PLANS[0].name}
          >
            {SYNTHFLOW_PLANS.map((plan) => (
              <div key={plan.name} className="flex items-center space-x-4">
                <RadioGroupItem value={plan.name} id={plan.name} />
                <Label htmlFor={plan.name} className="flex-1">
                  <div className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    <span className="text-muted-foreground">
                      ${plan.monthlyPrice}/month ({plan.minutesPerMonth} minutes)
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {totalMinutes > 6000 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-700">
                Your usage ({totalMinutes} minutes) exceeds the standard plan limit (6000 minutes).
                Additional minutes will be charged at $0.13 per minute.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
