
import { OperationsCalculation } from "@/types/make";

interface MakeCalculationSummaryProps {
  calculation: OperationsCalculation;
}

export function MakeCalculationSummary({ calculation }: MakeCalculationSummaryProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Estimated Total Calls: {calculation.totalCalls.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        Operations per Call: {calculation.operationsPerScenario}
      </p>
      <p className="text-sm text-gray-600">
        Total Operations Needed (including 20% buffer): {calculation.totalOperations.toLocaleString()}
      </p>
    </div>
  );
}
