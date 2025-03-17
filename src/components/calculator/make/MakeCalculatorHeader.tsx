
import { Button } from "@/components/ui/button";
import { ExternalLink, Workflow } from "lucide-react";
import { MAKE_PRICING_URL } from "@/constants/makePlans";
import { useTranslation } from "react-i18next";

export function MakeCalculatorHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
      <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Workflow className="h-5 w-5 text-indigo-600" />
        </div>
        Make Calculator
      </h3>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => window.open(MAKE_PRICING_URL, '_blank')}
        className="w-full sm:w-auto flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
      >
        <ExternalLink className="h-4 w-4 mr-1" />
        {t("viewMakePricing")}
      </Button>
    </div>
  );
}
