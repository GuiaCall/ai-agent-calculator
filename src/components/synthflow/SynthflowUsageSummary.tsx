
import React from "react";
import { useTranslation } from "react-i18next";
import { useCalculatorStateContext } from "../calculator/CalculatorStateContext";

interface SynthflowUsageSummaryProps {
  totalMinutes: number;
}

export function SynthflowUsageSummary({ totalMinutes }: SynthflowUsageSummaryProps) {
  const { t } = useTranslation();
  const { selectedSynthflowPlan, currency } = useCalculatorStateContext();
  
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
  
  return (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <p className="text-sm text-muted-foreground">
          {t("basedOnUsage")}: <span className="font-medium">{totalMinutes.toLocaleString()} {t("minutesPerMonth")}</span>
        </p>
      </div>
      
      {selectedSynthflowPlan && (
        <div className="bg-muted/30 p-3 rounded-md space-y-2">
          <h4 className="font-medium text-sm">{t("costBreakdown")}:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">
                {t("planAllowance")}: <span className="font-medium">{selectedSynthflowPlan.minutesPerMonth.toLocaleString()} {t("minutes")}</span>
              </p>
              <p className="text-muted-foreground">
                {t("planBaseCost")}: <span className="font-medium">{getCurrencySymbol(currency)}{getCurrencyConversion(selectedSynthflowPlan.monthlyPrice).toFixed(2)}</span>
              </p>
            </div>
            
            {selectedSynthflowPlan.overageMinutes > 0 && (
              <div>
                <p className="text-amber-600 font-medium">
                  {t("overageMinutes")}: {selectedSynthflowPlan.overageMinutes.toLocaleString()} {t("minutes")}
                </p>
                <p className="text-amber-600 font-medium">
                  {t("overageCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(selectedSynthflowPlan.overageCost || 0).toFixed(2)}
                </p>
                <p className="font-medium mt-1">
                  {t("totalCost")}: {getCurrencySymbol(currency)}{getCurrencyConversion(selectedSynthflowPlan.totalCost || 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
