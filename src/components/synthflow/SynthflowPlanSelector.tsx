
import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SynthflowPlan } from '@/types/synthflow';
import { useTranslation } from 'react-i18next';
import { useCalculatorStateContext } from '../calculator/CalculatorStateContext';

export interface SynthflowPlanSelectorProps {
  enhancedPlans: SynthflowPlan[];
  selectedPlan: SynthflowPlan | null;
  onPlanSelect: (plan: SynthflowPlan | null) => void;
  billingType: 'monthly' | 'yearly';
  recommendedPlan: SynthflowPlan | null;
}

export function SynthflowPlanSelector({
  enhancedPlans,
  selectedPlan,
  onPlanSelect,
  billingType,
  recommendedPlan
}: SynthflowPlanSelectorProps) {
  const { t } = useTranslation();
  const { currency } = useCalculatorStateContext();
  
  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
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
  
  const handlePlanClick = (plan: SynthflowPlan) => {
    onPlanSelect(plan.name === selectedPlan?.name ? null : plan);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t('selectPlan')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {enhancedPlans.map((plan) => {
          const isSelected = selectedPlan?.name === plan.name;
          const isRecommended = recommendedPlan?.name === plan.name;
          
          return (
            <Card 
              key={plan.name}
              className={cn(
                "cursor-pointer border-2 transition-all relative overflow-hidden",
                isSelected 
                  ? "border-indigo-600 bg-indigo-50/50" 
                  : isRecommended 
                    ? "border-emerald-300" 
                    : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => handlePlanClick(plan)}
            >
              {isRecommended && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-2 py-1 text-xs">
                  {t('recommendedPlan')}
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-md">{plan.name}</h3>
                  {isSelected && <Check className="text-indigo-600 h-5 w-5" />}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-2xl font-bold">
                      {getCurrencySymbol(currency)}{getCurrencyConversion(billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">/{t('month')}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {plan.minutesPerMonth.toLocaleString()} {t('minutes')}
                  </p>
                  
                  {plan.overageMinutes > 0 && (
                    <p className="text-sm text-indigo-700 font-medium mt-2">
                      + {plan.overageMinutes.toLocaleString()} {t('overageMinutes')}
                    </p>
                  )}
                  
                  {plan.totalCost && (
                    <p className="text-sm font-medium pt-2 border-t border-gray-200 mt-2">
                      {t('totalCost')}: {getCurrencySymbol(currency)}{getCurrencyConversion(plan.totalCost).toFixed(2)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
