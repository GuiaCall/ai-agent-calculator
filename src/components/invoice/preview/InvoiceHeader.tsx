
import { AgencyInfo } from "@/types/invoice";
import { useTranslation } from "react-i18next";

interface InvoiceHeaderProps {
  invoiceNumber: string | undefined;
  agencyInfo: AgencyInfo;
}

export function InvoiceHeader({ invoiceNumber, agencyInfo }: InvoiceHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{t("invoice")}</h1>
        <p className="text-indigo-100 mt-1">#{invoiceNumber}</p>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-semibold">{agencyInfo.name}</h2>
        <p className="text-indigo-100">{agencyInfo.website}</p>
      </div>
    </div>
  );
}
