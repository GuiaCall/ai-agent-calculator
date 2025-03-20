
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
    <div className="mt-4 border-t border-gray-200 pt-2 print:mt-2 print:pt-1">
      <div className="flex justify-end">
        <div className="w-1/2 space-y-1 print:space-y-0.5 print:text-xs">
          <div className="flex justify-between text-gray-600">
            <span>{t("subtotal")}</span>
            <span>{currencySymbol}{((totalCost || 0) + (setupCost || 0)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{t("tax")} ({taxRate}%)</span>
            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-indigo-600 pt-1 border-t border-gray-200 print:text-sm print:pt-0.5">
            <span>{t("total")}</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
