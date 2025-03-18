
import { useTranslation } from "react-i18next";

interface InvoiceServiceDetailsProps {
  callDuration: number;
  totalMinutes: number;
  costPerMinute: number;
  currencySymbol: string;
}

export function InvoiceServiceDetails({ 
  callDuration, 
  totalMinutes, 
  costPerMinute, 
  currencySymbol 
}: InvoiceServiceDetailsProps) {
  const { t } = useTranslation();
  
  // Calculate total calls per month
  const totalCallsPerMonth = callDuration > 0 ? Math.round(totalMinutes / callDuration) : 0;
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{t("serviceDetails")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{t("averageCallDuration")}</p>
          <p className="text-gray-800">{callDuration} {t("minutes")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{t("totalMinutesPerMonth")}</p>
          <p className="text-gray-800">{totalMinutes} {t("minutes")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{t("totalCallsPerMonth")}</p>
          <p className="text-gray-800">{totalCallsPerMonth}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{t("costPerMinute")}</p>
          <p className="text-gray-800">{currencySymbol}{costPerMinute.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
