
import React from "react";
import { format } from "date-fns";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "../CalculatorState";
import { useTranslation } from "react-i18next";
import { CalendarDays, Clock } from "lucide-react";

interface InvoiceExpandedDetailsProps {
  invoice: InvoiceHistory;
  currency: CurrencyType;
}

export function InvoiceExpandedDetails({
  invoice,
  currency
}: InvoiceExpandedDetailsProps) {
  const { t } = useTranslation();
  
  const getCurrencySymbol = (currency: CurrencyType) => {
    return currency === 'EUR' ? '€' : '$';
  };
  
  return (
    <tr className="bg-gray-50">
      <td colSpan={6} className="py-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">{t("invoice:clientDetails")}</h4>
            <p className="text-sm text-gray-600">{invoice.client_info.name}</p>
            <p className="text-sm text-gray-600">{invoice.client_info.address}</p>
            <p className="text-sm text-gray-600">{t("tvaNumber")}: {invoice.client_info.tvaNumber}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">{t("invoice:invoiceDetails")}</h4>
            <p className="text-sm text-gray-600 flex items-center">
              <CalendarDays size={14} className="mr-1" /> {t("invoice:created")}: {format(new Date(invoice.created_at), 'PPP')}
            </p>
            {invoice.last_exported_at && (
              <p className="text-sm text-gray-600 flex items-center">
                <Clock size={14} className="mr-1" /> {t("invoice:lastExported")}: {format(new Date(invoice.last_exported_at), 'PPP')}
              </p>
            )}
            <p className="text-sm text-gray-600">{t("invoice:setupCost")}: {getCurrencySymbol(currency)} {invoice.setup_cost.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">{t("invoice:summary")}</h4>
            <p className="text-sm text-gray-600">{t("invoice:totalMinutes")}: {invoice.total_minutes}</p>
            <p className="text-sm text-gray-600">{t("invoice:callDuration")}: {invoice.call_duration} min</p>
            <p className="text-sm text-gray-600">{t("margin")}: {invoice.margin}%</p>
            <p className="text-sm text-gray-600">{t("taxRate")}: {invoice.tax_rate}%</p>
          </div>
        </div>
      </td>
    </tr>
  );
}
