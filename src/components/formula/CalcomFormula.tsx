
import { useTranslation } from "react-i18next";

export function CalcomFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{t("calcomCalculator")} {t("costCalculation")}</h3>
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
