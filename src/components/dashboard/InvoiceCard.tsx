
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface InvoiceCardProps {
  totalInvoices: number | null;
}

export function InvoiceCard({ totalInvoices }: InvoiceCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{t("totalInvoices")}</h3>
      <CardContent className="p-0">
        <p className="text-3xl font-bold">
          {totalInvoices === null ? t("loading") : totalInvoices}
        </p>
      </CardContent>
    </Card>
  );
}
