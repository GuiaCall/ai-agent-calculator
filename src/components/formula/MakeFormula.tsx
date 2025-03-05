
import { useTranslation } from "react-i18next";

export function MakeFormula() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{t("makeOperationsCalculation")}</h3>
      <p className="text-gray-600">
        {t("totalCallsFormula")}
      </p>
      <p className="text-gray-600">
        {t("requiredOperationsFormula")}
      </p>
      <p className="text-gray-600 mt-1">
        {t("pricingTiersDetermined")}
      </p>
      <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
        <li>{t("operationsRange")}</li>
        <li>{t("corePlan")}</li>
        <li>{t("proPlan")}</li>
        <li>{t("teamsPlan")}</li>
      </ul>
      <p className="text-sm text-gray-500 mt-1">
        {t("multiplyBuffer")}
      </p>
      <p className="text-sm text-gray-500">
        {t("annualBillingPlans")}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {t("operationLimits")}
      </p>
      <p className="text-sm font-medium text-gray-700 mt-2">
        {t("yearlyPricesNote")}
      </p>
    </div>
  );
}
