
import React from "react";
import { useTranslation } from "react-i18next";
import { useCalculatorStateContext } from "../calculator/CalculatorStateContext";
import { SynthflowPlan } from "@/types/synthflow";

interface SynthflowUsageSummaryProps {
  totalMinutes: number;
  selectedPlan: SynthflowPlan;
  billingType: 'monthly' | 'yearly';
  getCurrencySymbol: (currency: string) => string;
  getCurrencyConversion: (amount: number) => number;
}

export function SynthflowUsageSummary({ 
  totalMinutes, 
  selectedPlan,
  billingType,
  getCurrencySymbol,
  getCurrencyConversion
}: SynthflowUsageSummaryProps) {
  const { t } = useTranslation();
  const { currency } = useCalculatorStateContext();
  
  // Get the price based on billing type
  const planPrice = billingType === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol(currency)}${getCurrencyConversion(amount).toFixed(2)}`;
  };

  // Calculate cost per minute for overage
  const overageCostPerMinute = 0.13; // $0.13 per minute
  
  return (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <p className="text-sm text-muted-foreground">
          {t("basedOnUsage")}: <span className="font-medium">{totalMinutes.toLocaleString()} {t("minutesPerMonth")}</span>
        </p>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-md space-y-2">
        <h4 className="font-medium text-sm">{t("costBreakdown")}:</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">
              {t("planAllowance")}: <span className="font-medium">{selectedPlan.minutesPerMonth.toLocaleString()} {t("minutes")}</span>
            </p>
            <p className="text-muted-foreground">
              {t("planBaseCost")}: <span className="font-medium">{formatCurrency(planPrice)}</span>
            </p>
          </div>
          
          <div>
            {selectedPlan.overageMinutes && selectedPlan.overageMinutes > 0 ? (
              <>
                <p className="text-indigo-700 font-bold">
                  {t("overageMinutes")}: {selectedPlan.overageMinutes.toLocaleString()} {t("minutes")}
                </p>
                <p className="text-indigo-700 font-bold">
                  {t("overageCost")}: {formatCurrency(selectedPlan.overageCost || 0)} 
                  <span className="text-xs ml-1">
                    ({formatCurrency(overageCostPerMinute)} / {t("minute")})
                  </span>
                </p>
              </>
            ) : (
              <p className="text-green-600 font-medium">
                {t("noOverage")}
              </p>
            )}
            <p className="font-medium mt-1">
              {t("totalCost")}: {formatCurrency(selectedPlan.totalCost || planPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
