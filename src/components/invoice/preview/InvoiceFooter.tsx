
import { AgencyInfo } from "@/types/invoice";
import { useTranslation } from "react-i18next";

interface InvoiceFooterProps {
  agencyInfo: AgencyInfo;
}

export function InvoiceFooter({ agencyInfo }: InvoiceFooterProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mt-8 pt-4 border-t border-gray-200 print:mt-4 print:pt-2">
      <div className="text-center text-gray-500 text-sm print:text-xs space-y-1">
        <p className="font-medium text-gray-600">{t("thankYou")}</p>
        <div className="pt-1">
          <p>{agencyInfo.name}</p>
          <p>{agencyInfo.address}</p>
          <p>{agencyInfo.email} | {agencyInfo.phone}</p>
        </div>
      </div>
    </div>
  );
}
