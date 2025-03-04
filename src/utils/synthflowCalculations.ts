
import { SynthflowPlan } from "@/types/synthflow";

export const calculateSynthflowCost = (totalMinutes: number, plan: SynthflowPlan | null, billingType: 'monthly' | 'yearly' = 'monthly'): number => {
  if (!plan) return 0;

  // Get the base price based on billing type
  const basePrice = billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  // For usage up to plan limit, use plan price
  if (totalMinutes <= plan.minutesPerMonth) {
    return basePrice;
  }

  // For usage above plan minutes:
  // 1. Calculate base cost (plan's price)
  // 2. Calculate extra minutes beyond plan limit
  // 3. Apply $0.13 per minute rate for extra minutes
  const extraMinutes = totalMinutes - plan.minutesPerMonth;
  const extraCost = extraMinutes * 0.13;

  return basePrice + extraCost;
};

export const calculateSynthflowCostPerMinute = (totalMinutes: number, plan: SynthflowPlan | null, billingType: 'monthly' | 'yearly' = 'monthly'): number => {
  if (!plan || totalMinutes === 0) return 0;
  
  const totalCost = calculateSynthflowCost(totalMinutes, plan, billingType);
  return totalCost / totalMinutes;
};
