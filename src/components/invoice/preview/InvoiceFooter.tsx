
import { AgencyInfo } from "@/types/invoice";
import { useTranslation } from "react-i18next";

interface InvoiceFooterProps {
  agencyInfo: AgencyInfo;
}

export function InvoiceFooter({ agencyInfo }: InvoiceFooterProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="text-center text-gray-500 text-sm space-y-2">
        <p className="font-medium text-gray-600">{t("thankYou")}</p>
        <div className="pt-2">
          <p>{agencyInfo.name}</p>
          <p>{agencyInfo.address}</p>
          <p>{agencyInfo.email} | {agencyInfo.phone}</p>
        </div>
      </div>
    </div>
  );
}
