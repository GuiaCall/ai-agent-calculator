
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SynthflowFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Activity className="h-5 w-5 text-indigo-600" />
        </div>
        Synthflow Cost Calculation
      </h3>
      <p className="text-gray-600">
        {t("monthlyCost")} = {t("selectedPlanBasePrice")} + {t("overageCost")}
      </p>
      <p className="text-gray-600">
        {t("overageCost")} = {t("overageMinutes")} × {t("overageRate")}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {t("synthflowFormulaDescription")}
      </p>
    </div>
  );
}
