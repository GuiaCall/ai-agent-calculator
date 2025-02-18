
import { SynthflowPlan } from "@/types/synthflow";

export const calculateSynthflowCost = (totalMinutes: number, plan: SynthflowPlan | null): number => {
  if (!plan) return 0;

  if (totalMinutes <= 6000) {
    return plan.monthlyPrice;
  }

  // For usage above 6000 minutes:
  // Base cost for 6000 minutes = $1400
  // Additional minutes charged at $0.13 per minute
  const baseCost = 1400;
  const extraMinutes = totalMinutes - 6000;
  const extraCost = extraMinutes * 0.13;

  return baseCost + extraCost;
};
