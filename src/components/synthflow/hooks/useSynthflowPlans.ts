
import { useState, useEffect } from "react";
import { SynthflowPlan } from "@/types/synthflow";
import { SYNTHFLOW_PLANS } from "@/constants/synthflowPlans";
import { useCalculatorStateContext } from "../../calculator/CalculatorStateContext";

export function useSynthflowPlans(totalMinutes: number, billingType: 'monthly' | 'yearly') {
  const { currency } = useCalculatorStateContext();
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      default:
        return amount;
    }
  };
  
  // Calculate costs and enhancements for each plan
  const enhancedPlans = SYNTHFLOW_PLANS.map(plan => {
    const basePrice = billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const overageMinutes = Math.max(0, totalMinutes - plan.minutesPerMonth);
    const overageCost = overageMinutes * 0.13; // $0.13 per minute for overage
    const totalCost = basePrice + overageCost;
    const costPerMinute = totalMinutes > 0 ? totalCost / totalMinutes : 0;
    
    return {
      ...plan,
      overageMinutes,
      overageCost,
      totalCost,
      costPerMinute,
      isRecommended: false
    };
  });
  
  // Find the most cost-effective plan
  const recommendedPlan = [...enhancedPlans].sort((a, b) => a.totalCost - b.totalCost)[0];
  
  // Mark the recommended plan
  const plansWithRecommendation = enhancedPlans.map(plan => ({
    ...plan,
    isRecommended: plan.name === recommendedPlan.name
  }));

  return {
    enhancedPlans: plansWithRecommendation,
    recommendedPlan,
    getCurrencySymbol,
    getCurrencyConversion
  };
}
