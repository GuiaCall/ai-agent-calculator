
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function VapiFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Clock className="h-5 w-5 text-indigo-600" />
        </div>
        Vapi Cost Calculation
      </h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          {t("monthlyCost")} = {t("costPerMinute")} × {t("totalMinutes")}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {t("vapiFormulaDescription", "The cost per minute is set by the user based on Vapi pricing, and the total minutes are taken from the calculator settings.")}
        </p>
        <p className="text-sm text-gray-500">
          {t("visitVapiWebsite", "Visit the Vapi website for current pricing information.")}
        </p>
      </div>
    </div>
  );
}
