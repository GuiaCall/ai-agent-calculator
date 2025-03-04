
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAKE_PRICING_URL } from "@/constants/makePlans";
import { ExternalLink } from "lucide-react";
import { MakePlan, MakeRecommendedPlan, OperationsCalculation } from "@/types/make";
import { calculateMakeOperations, calculateRequiredPlanPrice } from "@/utils/makeCalculations";
import { Badge } from "./ui/badge";

export function MakeCalculator({
  totalMinutes,
  averageCallDuration,
  onPlanSelect,
  onCostPerMinuteChange,
}: {
  totalMinutes: number;
  averageCallDuration: number;
  onPlanSelect: (plan: MakePlan) => void;
  onCostPerMinuteChange: (cost: number) => void;
}) {
  const [operationsPerScenario, setOperationsPerScenario] = useState<number>(100);
  const [selectedPlanType, setSelectedPlanType] = useState<string>("monthly");
  const [calculation, setCalculation] = useState<OperationsCalculation | null>(null);
  const [recommendations, setRecommendations] = useState<MakeRecommendedPlan[]>([]);
  const [recommendedPlan, setRecommendedPlan] = useState<MakeRecommendedPlan | null>(null);

  const calculateOperations = () => {
    const { totalCalls, totalOperations } = calculateMakeOperations(
      totalMinutes,
      averageCallDuration,
      operationsPerScenario
    );
    
    const { 
      totalPrice, 
      operationsIncluded,
      costPerMinute,
      recommendations: planRecommendations,
      recommendedPlan: optimalPlan
    } = calculateRequiredPlanPrice(
      totalOperations,
      selectedPlanType,
      totalMinutes
    );

    // Create adapter for legacy MakePlan format
    const adaptedPlan: MakePlan = {
      name: optimalPlan.name,
      operationsPerMonth: optimalPlan.operationsPerMonth,
      monthlyPrice: selectedPlanType === 'monthly' ? optimalPlan.price : optimalPlan.price * 1.18, // Estimate monthly price
      yearlyPrice: selectedPlanType === 'yearly' ? optimalPlan.price : optimalPlan.price * 0.85 // Estimate yearly price
    };

    setCalculation({
      totalCalls,
      operationsPerScenario,
      totalOperations,
      recommendedPlan: adaptedPlan
    });

    setRecommendations(planRecommendations);
    setRecommendedPlan(optimalPlan);

    onPlanSelect(adaptedPlan);
    onCostPerMinuteChange(costPerMinute);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Make.com Operations Calculator</h3>
        <Button 
          variant="outline"
          className="animate-pulse hover:animate-none bg-primary/10 hover:bg-primary/20 text-primary font-semibold"
          onClick={() => window.open(MAKE_PRICING_URL, '_blank')}
        >
          View Make.com Pricing <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="operations">Operations per Scenario</Label>
          <Input
            id="operations"
            type="number"
            value={operationsPerScenario}
            onChange={(e) => setOperationsPerScenario(Number(e.target.value))}
            min="1"
          />
          <p className="text-sm text-gray-500">
            Enter the number of operations consumed by your Make.com scenarios
          </p>
        </div>

        <div className="space-y-2">
          <Label>Billing Cycle</Label>
          <Select
            value={selectedPlanType}
            onValueChange={setSelectedPlanType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly (Save up to 15%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateOperations} className="w-full">
          Calculate Required Operations
        </Button>

        {calculation && (
          <div className="space-y-4 p-4 bg-secondary rounded-lg">
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

            {recommendations.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-gray-200">
                <p className="font-semibold">Available Plans:</p>
                <div className="grid grid-cols-1 gap-3">
                  {recommendations.map((plan, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${plan.name === recommendedPlan?.name ? 'bg-primary/20 border border-primary/30' : 'bg-background'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{plan.name}</span>
                          {plan.name === recommendedPlan?.name && (
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <span className="font-semibold">
                          ${plan.price.toFixed(2)}/{selectedPlanType === "monthly" ? "month" : "month (billed yearly)"}
                        </span>
                      </div>
                      {plan.savingsPercentage && (
                        <p className="text-sm text-green-600 mt-1">
                          Save {plan.savingsPercentage}% vs monthly billing
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {recommendedPlan && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => window.open('https://rb.gy/8nusbv', '_blank')}
                  >
                    Get Recommended Plan <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
