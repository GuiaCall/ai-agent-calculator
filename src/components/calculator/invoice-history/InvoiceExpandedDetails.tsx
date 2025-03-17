
import { Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "../CalculatorState";
import { getCurrencySymbol } from "@/utils/currencyUtils";

interface InvoiceExpandedDetailsProps {
  invoice: InvoiceHistory;
  currency: CurrencyType;
}

export function InvoiceExpandedDetails({ 
  invoice, 
  currency 
}: InvoiceExpandedDetailsProps) {
  const { t } = useTranslation();
  const currencySymbol = getCurrencySymbol(currency);
  
  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="py-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">{t("clientDetails")}</h4>
            <p className="text-sm text-gray-600">{invoice.client_info.name}</p>
            <p className="text-sm text-gray-600">{invoice.client_info.address}</p>
            <p className="text-sm text-gray-600">{t("tvaNumber")}: {invoice.client_info.tvaNumber}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">{t("invoiceDetails")}</h4>
            <p className="text-sm text-gray-600 flex items-center">
              <CalendarDays size={14} className="mr-1" /> {t("created")}: {format(new Date(invoice.created_at), 'PPP')}
            </p>
            {invoice.last_exported_at && (
              <p className="text-sm text-gray-600 flex items-center">
                <Clock size={14} className="mr-1" /> {t("lastExported")}: {format(new Date(invoice.last_exported_at), 'PPP')}
              </p>
            )}
            <p className="text-sm text-gray-600">{t("setupCost")}: {currencySymbol} {invoice.setup_cost.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">{t("summary")}</h4>
            <p className="text-sm text-gray-600">{t("totalMinutes")}: {invoice.total_minutes}</p>
            <p className="text-sm text-gray-600">{t("callDuration")}: {invoice.call_duration} min</p>
            <p className="text-sm text-gray-600">{t("margin")}: {invoice.margin}%</p>
            <p className="text-sm text-gray-600">{t("taxRate")}: {invoice.tax_rate}%</p>
          </div>
        </div>
      </td>
    </tr>
  );
}
