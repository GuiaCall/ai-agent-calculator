
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
        <h1 className="text-2xl font-bold print:text-xl">{t("invoice")}</h1>
        <p className="text-indigo-100 mt-1 print:text-sm">#{invoiceNumber}</p>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-semibold print:text-lg">{agencyInfo.name}</h2>
        <p className="text-indigo-100 print:text-sm">{agencyInfo.website}</p>
      </div>
    </div>
  );
}
