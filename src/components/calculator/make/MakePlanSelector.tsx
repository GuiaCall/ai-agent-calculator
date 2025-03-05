
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink } from "lucide-react";
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
  const isPricePerYear = selectedPlanType === 'yearly';
  
  return (
    <div className="space-y-4">
      <p className="font-semibold text-base">Available Plans:</p>
      <div className="grid grid-cols-1 gap-3">
        {recommendations.map((plan, index) => {
          // For yearly billing, convert the yearly price to monthly equivalent
          const displayPrice = isPricePerYear 
            ? (plan.price / 12).toFixed(2)
            : plan.price.toFixed(2);
            
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedPlan?.name === plan.name 
                  ? 'bg-indigo-50 border border-indigo-400 shadow-md transform -translate-y-1' 
                  : plan.name === recommendedPlan?.name 
                    ? 'bg-primary/5 border border-primary/40 hover:border-indigo-300 hover:bg-indigo-50/50' 
                    : 'bg-background border border-border hover:border-indigo-200 hover:bg-indigo-50/30'
              }`}
              onClick={() => onPlanSelect(plan)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {selectedPlan?.name === plan.name && (
                    <Check className="h-4 w-4 text-indigo-600 mr-2" />
                  )}
                  <span className={`font-semibold ${selectedPlan?.name === plan.name ? 'text-indigo-700' : ''}`}>{plan.name}</span>
                  {plan.name === recommendedPlan?.name && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                      Recommended
                    </Badge>
                  )}
                </div>
                <span className={`font-semibold ${selectedPlan?.name === plan.name ? 'text-indigo-700' : ''}`}>
                  ${displayPrice}/month
                  {isPricePerYear && (
                    <span className="text-xs text-gray-500 ml-1">(billed yearly)</span>
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {plan.operationsPerMonth.toLocaleString()} operations per month
              </p>
              {plan.savingsPercentage && isPricePerYear && (
                <p className="text-sm text-green-600 mt-1">
                  Save {plan.savingsPercentage}% vs monthly billing
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedPlan && (
        <Button 
          variant="outline" 
          className="w-full mt-2 flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all"
          onClick={() => window.open('https://rb.gy/8nusbv', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Get Selected Plan
        </Button>
      )}
    </div>
  );
}
