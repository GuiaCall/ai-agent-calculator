
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FreePlanCardProps {
  invoiceCount: number;
  isSubscribed: boolean;
}

export function FreePlanCard({ invoiceCount, isSubscribed }: FreePlanCardProps) {
  const { t } = useTranslation();
  
  return (
    <Card className={`p-8 border-2 hover:border-primary transition-all ${!isSubscribed ? 'border-primary' : ''}`}>
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-3">{t("freePlan")}</h3>
        <p className="text-gray-600 mb-6">{t("freePlanDescription")}</p>
        <div className="text-3xl font-bold">
          €0/<span className="text-xl text-gray-500">{t("month")}</span>
        </div>
      </div>

      <div className="space-y-5 mb-10">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("generateUpToFiveInvoices", { count: invoiceCount })}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("basicInvoiceGeneration")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("pdfExportFunctionality")}</span>
        </div>
      </div>

      <Button 
        className="w-full" 
        variant="outline" 
        disabled={true}
      >
        {isSubscribed ? t("upgradeToProFirst") : t("currentPlan")}
      </Button>
    </Card>
  );
}
