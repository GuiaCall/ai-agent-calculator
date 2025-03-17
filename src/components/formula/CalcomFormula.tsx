
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CalcomFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-indigo-800 font-bold text-xl flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Calendar className="h-5 w-5 text-indigo-600" />
        </div>
        Cal.com Calculator {t("costCalculation")}
      </h3>
      <p className="text-gray-600">
        {t("monthlyCost")} = {t("selectedPlanBasePrice")} + {t("teamMemberCost")}
      </p>
      <p className="text-gray-600">
        {t("teamMemberCost")} = {t("numberOfUsers")} × $12
      </p>
      <p className="text-gray-600">
        {t("costPerMinute")} = {t("monthlyCost")} ÷ {t("totalMinutes")}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {t("calcomFormulaDescription")}
      </p>
    </div>
  );
}
