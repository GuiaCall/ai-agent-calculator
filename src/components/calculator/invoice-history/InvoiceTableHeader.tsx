
import { useTranslation } from "react-i18next";

export function InvoiceTableHeader() {
  const { t } = useTranslation();
  
  return (
    <thead>
      <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <th className="py-3 px-4 text-left">{t("invoiceNumber")}</th>
        <th className="py-3 px-4 text-left">{t("date")}</th>
        <th className="py-3 px-4 text-left">{t("client")}</th>
        <th className="py-3 px-4 text-right">{t("amount")}</th>
        <th className="py-3 px-4 text-center">{t("actions")}</th>
      </tr>
    </thead>
  );
}
