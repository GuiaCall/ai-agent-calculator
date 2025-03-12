
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

export function SubscriptionCard() { 
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{t("invoicingSystem")}</h3>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">{t("free")}</p>
          <div className="flex items-center text-green-500 mt-1">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span className="text-sm">{t("unlimitedInvoices")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
