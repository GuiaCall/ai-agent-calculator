
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { CurrencyType } from "@/components/calculator/CalculatorState";

interface InvoiceBillingInfoProps {
  clientInfo: ClientInfo;
  total: number;
  currencySymbol: string;
}

export function InvoiceBillingInfo({ clientInfo, total, currencySymbol }: InvoiceBillingInfoProps) {
  const { t } = useTranslation();
  
  const currentDate = format(new Date(), 'dd MMM yyyy');
  const dueDate = format(new Date(new Date().setDate(new Date().getDate() + 30)), 'dd MMM yyyy');
  
  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">{t("billTo")}:</h3>
        <div className="space-y-1 text-gray-600">
          <p className="font-medium text-gray-800">{clientInfo.name}</p>
          <p>{clientInfo.address}</p>
          <p>{t("tvaNumber")}: {clientInfo.tvaNumber}</p>
          <p>{t("contact")}: {clientInfo.contactPerson.name}</p>
          <p>{t("phone")}: {clientInfo.contactPerson.phone}</p>
        </div>
      </div>
      
      <div className="text-right">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold mb-1 text-gray-500">{t("invoiceDate").toUpperCase()}</h3>
            <p className="text-gray-800">{currentDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1 text-gray-500">{t("dueDate").toUpperCase()}</h3>
            <p className="text-gray-800">{dueDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1 text-gray-500">{t("amountDue").toUpperCase()}</h3>
            <p className="text-xl font-bold text-indigo-600">{currencySymbol}{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
