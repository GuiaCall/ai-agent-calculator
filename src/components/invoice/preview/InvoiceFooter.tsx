
import { AgencyInfo } from "@/types/invoice";
import { useTranslation } from "react-i18next";

interface InvoiceFooterProps {
  agencyInfo: AgencyInfo;
}

export function InvoiceFooter({ agencyInfo }: InvoiceFooterProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6 pt-2 border-t border-gray-200 print:mt-2 print:pt-1">
      <div className="text-center text-gray-500 text-sm print:text-xs space-y-0.5">
        <p className="font-medium text-gray-600">{t("thankYou")}</p>
        <div className="pt-0.5 print:text-[10px]">
          <p>{agencyInfo.name}</p>
          <p>{agencyInfo.address}</p>
          <p>{agencyInfo.email} | {agencyInfo.phone}</p>
        </div>
      </div>
    </div>
  );
}
