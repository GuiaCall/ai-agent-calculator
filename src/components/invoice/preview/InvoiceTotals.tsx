
import { useTranslation } from "react-i18next";

interface InvoiceTotalsProps {
  totalCost: number | null;
  setupCost: number | null;
  taxRate: number;
  taxAmount: number;
  total: number;
  currencySymbol: string;
}

export function InvoiceTotals({ 
  totalCost, 
  setupCost, 
  taxRate, 
  taxAmount,
  total, 
  currencySymbol 
}: InvoiceTotalsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6 border-t border-gray-200 pt-4 print:mt-3 print:pt-3">
      <div className="flex justify-end">
        <div className="w-1/2 space-y-2 print:space-y-1 print:text-xs">
          <div className="flex justify-between text-gray-600">
            <span>{t("subtotal")}</span>
            <span>{currencySymbol}{((totalCost || 0) + (setupCost || 0)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{t("tax")} ({taxRate}%)</span>
            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-indigo-600 pt-2 border-t border-gray-200 print:text-base print:pt-1">
            <span>{t("total")}</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
