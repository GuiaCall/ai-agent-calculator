
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { MakeRecommendedPlan } from "@/types/make";

interface MakePlanSelectorProps {
  recommendations: MakeRecommendedPlan[];
  selectedPlan: MakeRecommendedPlan | null;
  recommendedPlan: MakeRecommendedPlan | null;
  selectedPlanType: string;
  onPlanSelect: (plan: MakeRecommendedPlan) => void;
}

export function MakePlanSelector({
  recommendations,
  selectedPlan,
  recommendedPlan,
  selectedPlanType,
  onPlanSelect,
}: MakePlanSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="font-semibold">Available Plans:</p>
      <div className="grid grid-cols-1 gap-3">
        {recommendations.map((plan, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedPlan?.name === plan.name 
                ? 'bg-primary/20 border border-primary/30' 
                : 'bg-background hover:bg-primary/5'
            }`}
            onClick={() => onPlanSelect(plan)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {selectedPlan?.name === plan.name && (
                  <Check className="h-4 w-4 text-primary mr-2" />
                )}
                <span className="font-semibold">{plan.name}</span>
                {plan.name === recommendedPlan?.name && (
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                    Recommended
                  </Badge>
                )}
              </div>
              <span className="font-semibold">
                ${plan.price.toFixed(2)}/{selectedPlanType === "monthly" ? "month" : "year"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {plan.operationsPerMonth.toLocaleString()} operations per month
            </p>
            {plan.savingsPercentage && (
              <p className="text-sm text-green-600 mt-1">
                Save {plan.savingsPercentage}% vs monthly billing
              </p>
            )}
          </div>
        ))}
      </div>
      
      {selectedPlan && (
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={() => window.open('https://rb.gy/8nusbv', '_blank')}
        >
          Get Selected Plan <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
