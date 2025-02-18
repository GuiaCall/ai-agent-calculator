
export interface SynthflowPlan {
  name: string;
  minutesPerMonth: number;
  monthlyPrice: number;
  yearlyPrice: number;
  costPerMinute?: number;
}

export interface SynthflowCalculation {
  selectedPlan: SynthflowPlan | null;
  billingType: 'monthly' | 'yearly';
}
