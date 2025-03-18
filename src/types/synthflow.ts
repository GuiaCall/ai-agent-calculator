
export interface SynthflowPlan {
  name: string;
  minutesPerMonth: number;
  monthlyPrice: number;
  yearlyPrice: number;
  costPerMinute?: number;
  totalCost?: number;  // Adding this property
  overageMinutes?: number;
  overageCost?: number;
  isRecommended?: boolean;
}

export interface SynthflowCalculation {
  selectedPlan: SynthflowPlan | null;
  billingType: 'monthly' | 'yearly';
}
