
import React from "react";
import { useTranslation } from "react-i18next";

export function InvoiceEmptyState() {
  const { t } = useTranslation();
  
  return (
    <div className="py-8 text-center text-gray-500">
      <p>{t("invoice:noInvoicesFound")}</p>
    </div>
  );
}
