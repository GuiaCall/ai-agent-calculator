
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface InvoiceCardProps {
  totalInvoices: number | null;
  isPlanFree: boolean;
}

export function InvoiceCard({ totalInvoices, isPlanFree }: InvoiceCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{t("totalInvoices")}</h3>
      <p className="text-3xl font-bold">
        {totalInvoices === null ? t("loading") : totalInvoices}
      </p>
      {isPlanFree && totalInvoices !== null && (
        <p className="text-sm text-gray-500 mt-2">
          {t("freeInvoicesUsed", { used: totalInvoices, total: 5 })}
        </p>
      )}
    </Card>
  );
}
