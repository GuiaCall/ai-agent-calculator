
import { ExternalLink } from "lucide-react";
import { MakeRecommendedPlan, OperationsCalculation } from "@/types/make";
import { MakeCalculationSummary } from "./MakeCalculationSummary";
import { MakePlanSelector } from "./MakePlanSelector";
import { useTranslation } from "react-i18next";

interface MakeCalculationResultsProps {
  calculation: OperationsCalculation;
  recommendations: MakeRecommendedPlan[];
  recommendedPlan: MakeRecommendedPlan | null;
  selectedPlan: MakeRecommendedPlan | null;
  selectedPlanType: string;
  onPlanSelect: (plan: MakeRecommendedPlan) => void;
}

export function MakeCalculationResults({
  calculation,
  recommendations,
  recommendedPlan,
  selectedPlan,
  selectedPlanType,
  onPlanSelect
}: MakeCalculationResultsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 p-4 bg-secondary rounded-lg">
      <MakeCalculationSummary calculation={calculation} />
      
      {recommendations.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <MakePlanSelector
            recommendations={recommendations}
            selectedPlan={selectedPlan}
            recommendedPlan={recommendedPlan}
            selectedPlanType={selectedPlanType}
            onPlanSelect={onPlanSelect}
          />
        </div>
      )}
    </div>
  );
}
