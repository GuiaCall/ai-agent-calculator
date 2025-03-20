
import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

interface InvoiceTableHeaderRowProps {
  isMultiSelectMode: boolean;
  onToggleSelectAll: () => void;
  allSelected: boolean;
  hasInvoices: boolean;
}

export function InvoiceTableHeaderRow({
  isMultiSelectMode,
  onToggleSelectAll,
  allSelected,
  hasInvoices
}: InvoiceTableHeaderRowProps) {
  const { t } = useTranslation();
  
  return (
    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      {isMultiSelectMode && (
        <th className="py-3 px-4 text-left">
          <Checkbox 
            checked={hasInvoices && allSelected}
            onCheckedChange={onToggleSelectAll}
            className="bg-white/20 border-white data-[state=checked]:bg-white data-[state=checked]:text-indigo-600"
          />
        </th>
      )}
      <th className="py-3 px-4 text-left">{t("invoice:invoiceNumber")}</th>
      <th className="py-3 px-4 text-left">{t("invoice:date")}</th>
      <th className="py-3 px-4 text-left">{t("invoice:client")}</th>
      <th className="py-3 px-4 text-right">{t("invoice:amount")}</th>
      <th className="py-3 px-4 text-center">{t("invoice:actions")}</th>
    </tr>
  );
}
