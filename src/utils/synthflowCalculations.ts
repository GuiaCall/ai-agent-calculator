
import { SynthflowPlan } from "@/types/synthflow";

export const calculateSynthflowCost = (totalMinutes: number, plan: SynthflowPlan | null): number => {
  if (!plan) return 0;

  // For usage up to plan limit, use plan price
  if (totalMinutes <= plan.minutesPerMonth) {
    return plan.monthlyPrice;
  }

  // For usage above plan minutes:
  // 1. Calculate base cost (plan's monthly price)
  // 2. Calculate extra minutes beyond plan limit
  // 3. Apply $0.13 per minute rate for extra minutes
  const baseCost = plan.monthlyPrice;
  const extraMinutes = totalMinutes - plan.minutesPerMonth;
  const extraCost = extraMinutes * 0.13;

  return baseCost + extraCost;
};

export const calculateSynthflowCostPerMinute = (totalMinutes: number, plan: SynthflowPlan | null): number => {
  if (!plan || totalMinutes === 0) return 0;
  
  const totalCost = calculateSynthflowCost(totalMinutes, plan);
  return totalCost / totalMinutes;
};
