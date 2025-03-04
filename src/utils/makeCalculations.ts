
import { 
  MAKE_CORE_MONTHLY_TIERS, 
  MAKE_CORE_YEARLY_TIERS,
  MAKE_PRO_MONTHLY_TIERS,
  MAKE_PRO_YEARLY_TIERS,
  MAKE_TEAMS_MONTHLY_TIERS, 
  MAKE_TEAMS_YEARLY_TIERS,
  calculateSavingsPercentage
} from "@/constants/makePlans";
import { MakePricingTier, MakeRecommendedPlan } from "@/types/make";

export const calculateMakeOperations = (totalMinutes: number, averageCallDuration: number, operationsPerScenario: number) => {
  const safeCallDuration = Math.max(averageCallDuration, 1);
  const totalCalls = Math.ceil(totalMinutes / safeCallDuration);
  const totalOperations = Math.ceil(totalCalls * operationsPerScenario * 1.2); // Adding 20% buffer
  return { totalCalls, totalOperations };
};

const findAppropriatePrice = (operations: number, tiers: MakePricingTier[]): { operationsPerMonth: number; price: number } => {
  // Sort tiers by operations in ascending order to ensure proper search
  const sortedTiers = [...tiers].sort((a, b) => a.operationsPerMonth - b.operationsPerMonth);
  
  // Find the first tier that can accommodate the operations
  for (const tier of sortedTiers) {
    if (tier.operationsPerMonth >= operations) {
      return tier;
    }
  }
  
  // If no tier is large enough, return the largest tier
  return sortedTiers[sortedTiers.length - 1];
};

export const findOptimalPlan = (
  totalOperations: number, 
  planType: 'Core' | 'Pro' | 'Teams', 
  billingType: 'monthly' | 'yearly'
): MakeRecommendedPlan => {
  let tierData;
  
  if (planType === 'Core') {
    tierData = billingType === 'monthly' 
      ? findAppropriatePrice(totalOperations, MAKE_CORE_MONTHLY_TIERS)
      : findAppropriatePrice(totalOperations, MAKE_CORE_YEARLY_TIERS);
  } else if (planType === 'Pro') {
    tierData = billingType === 'monthly' 
      ? findAppropriatePrice(totalOperations, MAKE_PRO_MONTHLY_TIERS)
      : findAppropriatePrice(totalOperations, MAKE_PRO_YEARLY_TIERS);
  } else { // Teams
    tierData = billingType === 'monthly' 
      ? findAppropriatePrice(totalOperations, MAKE_TEAMS_MONTHLY_TIERS)
      : findAppropriatePrice(totalOperations, MAKE_TEAMS_YEARLY_TIERS);
  }
  
  // Calculate savings if yearly billing
  let savingsPercentage;
  if (billingType === 'yearly') {
    // Find the equivalent monthly price for the same operations
    let monthlyTiers;
    if (planType === 'Core') {
      monthlyTiers = MAKE_CORE_MONTHLY_TIERS;
    } else if (planType === 'Pro') {
      monthlyTiers = MAKE_PRO_MONTHLY_TIERS;
    } else { // Teams
      monthlyTiers = MAKE_TEAMS_MONTHLY_TIERS;
    }
    
    const equivalentMonthlyTier = findAppropriatePrice(tierData.operationsPerMonth, monthlyTiers);
    savingsPercentage = calculateSavingsPercentage(equivalentMonthlyTier.price, tierData.price);
  }
  
  return {
    name: `${planType} (${tierData.operationsPerMonth.toLocaleString()} ops)`,
    planType,
    billingType,
    operationsPerMonth: tierData.operationsPerMonth,
    price: tierData.price,
    savingsPercentage
  };
};

export const calculateRequiredPlanPrice = (totalOperations: number, selectedPlanType: string, totalMinutes: number) => {
  const billingType = selectedPlanType === 'monthly' ? 'monthly' : 'yearly';
  const planTypes: ('Core' | 'Pro' | 'Teams')[] = ['Core', 'Pro', 'Teams'];
  
  // Find optimal plan for each plan type
  const recommendations = planTypes.map(planType => 
    findOptimalPlan(totalOperations, planType, billingType)
  );
  
  // Find the recommended plan (smallest that can accommodate the operations)
  const recommendedPlan = recommendations.reduce((prev, current) => 
    (current.operationsPerMonth >= totalOperations && current.price < prev.price) ? current : prev
  , recommendations[0]);
  
  const costPerMinute = totalMinutes > 0 ? recommendedPlan.price / totalMinutes : 0;
  
  return {
    totalPrice: recommendedPlan.price,
    operationsIncluded: recommendedPlan.operationsPerMonth,
    costPerMinute,
    recommendations,
    recommendedPlan
  };
};
