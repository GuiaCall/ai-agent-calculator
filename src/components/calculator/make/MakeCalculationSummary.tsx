
import { OperationsCalculation } from "@/types/make";
import { useTranslation } from "react-i18next";

interface MakeCalculationSummaryProps {
  calculation: OperationsCalculation;
}

export function MakeCalculationSummary({ calculation }: MakeCalculationSummaryProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        {t("totalCallsFormula")}: {calculation.totalCalls.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        {t("operationsPerScenario")}: {calculation.operationsPerScenario}
      </p>
      <p className="text-sm text-gray-600">
        {t("requiredOperationsFormula")}: {calculation.totalOperations.toLocaleString()}
      </p>
    </div>
  );
}
