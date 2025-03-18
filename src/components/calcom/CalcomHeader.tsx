
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";
import { CALCOM_PRICING_URL } from "@/constants/calcomPlans";
import { useTranslation } from "react-i18next";

export function CalcomHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Calendar className="h-5 w-5 text-indigo-600" />
        </div>
        Cal.com Calculator
      </h3>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.open(CALCOM_PRICING_URL, '_blank')}
        className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
      >
        {t("viewCalcomPricing")} <ExternalLink className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
}
