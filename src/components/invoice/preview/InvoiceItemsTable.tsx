
import { useTranslation } from "react-i18next";

interface InvoiceItemsTableProps {
  totalMinutes: number;
  totalCost: number | null;
  setupCost: number | null;
  costPerMinute: number;
  currencySymbol: string;
}

export function InvoiceItemsTable({ 
  totalMinutes, 
  totalCost, 
  setupCost, 
  costPerMinute, 
  currencySymbol 
}: InvoiceItemsTableProps) {
  const { t } = useTranslation();
  
  return (
    <table className="w-full text-left print:text-xs">
      <thead>
        <tr className="bg-gray-50 text-gray-600 text-sm font-medium print:text-xs">
          <th className="py-2 px-3 border-b border-gray-200">{t("description").toUpperCase()}</th>
          <th className="py-2 px-3 border-b border-gray-200">{t("quantity").toUpperCase()}</th>
          <th className="py-2 px-3 border-b border-gray-200">{t("rate").toUpperCase()}</th>
          <th className="py-2 px-3 border-b border-gray-200 text-right">{t("amount").toUpperCase()}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {setupCost && setupCost > 0 && (
          <tr className="text-gray-700">
            <td className="py-3 px-3">
              <div className="font-medium">{t("setupCost")}</div>
              <div className="text-sm text-gray-500 print:text-xs">{t("setupDescription")}</div>
            </td>
            <td className="py-3 px-3">1</td>
            <td className="py-3 px-3">{currencySymbol}{setupCost.toFixed(2)}</td>
            <td className="py-3 px-3 text-right">{currencySymbol}{setupCost.toFixed(2)}</td>
          </tr>
        )}
        <tr className="text-gray-700">
          <td className="py-3 px-3">
            <div className="font-medium">{t("aiVoiceService")}</div>
            <div className="text-sm text-gray-500 print:text-xs">{t("monthlySubscription")}</div>
          </td>
          <td className="py-3 px-3">{totalMinutes} {t("minutes")}</td>
          <td className="py-3 px-3">{currencySymbol}{costPerMinute.toFixed(4)}/{t("min")}</td>
          <td className="py-3 px-3 text-right">{currencySymbol}{(totalCost || 0).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}
