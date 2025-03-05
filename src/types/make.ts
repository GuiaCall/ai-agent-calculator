
export interface MakePlan {
  name: string;
  operationsPerMonth: number;
  monthlyPrice: number;
  yearlyPrice: number;
}

export interface MakePricingTier {
  operationsPerMonth: number;
  price: number;
}

export interface OperationsCalculation {
  totalCalls: number;
  operationsPerScenario: number;
  totalOperations: number;
  recommendedPlan: MakePlan | null;
}

export interface MakeRecommendedPlan {
  name: string;
  planType: 'Core' | 'Pro' | 'Teams';
  billingType: 'monthly' | 'yearly';
  operationsPerMonth: number;
  price: number;
  monthlyEquivalent: number; // Monthly equivalent price for display/calculation
  savingsPercentage?: number;
}
