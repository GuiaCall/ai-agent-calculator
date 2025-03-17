
import { MakeCalculator } from "./make/MakeCalculator";
import { SynthflowCalculator } from "../SynthflowCalculator";
import { CalcomCalculator } from "../CalcomCalculator";
import { TwilioCalculator } from "../TwilioCalculator";
import { VapiCalculator } from "../VapiCalculator";
import { BlandAICalculator } from "../BlandAICalculator";
import { AIServiceCalculator } from "../AIServiceCalculator";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { CalcomPlan } from "@/types/calcom";

export function TechnologyCalculators() {
  const state = useCalculatorStateContext();

  const handleCalcomPlanSelect = (plan: CalcomPlan, users: number) => {
    state.setSelectedCalcomPlan(plan);
    state.setNumberOfUsers(users);
    
    // Calculate monthly cost (not cost per minute) for the technology parameter
    const teamMemberCost = (plan.name === "Team" || plan.name === "Organization") && users > 0
      ? users * plan.pricePerUser
      : 0;
    
    const monthlyCost = plan.basePrice + teamMemberCost;
    
    // Update the technology parameter with the monthly cost
    state.setTechnologies((techs) =>
      techs.map((tech) =>
        tech.id === "calcom" ? { ...tech, costPerMinute: monthlyCost } : tech
      )
    );
  };

  return (
    <div className="space-y-6">
      {state.technologies.find((t) => t.id === "make")?.isSelected && (
        <MakeCalculator
          totalMinutes={state.totalMinutes}
          averageCallDuration={state.callDuration}
          onPlanSelect={state.setSelectedMakePlan}
          onCostPerMinuteChange={(cost) => {
            // This is handled in MakeCalculator directly now
          }}
        />
      )}

      {state.technologies.find((t) => t.id === "synthflow")?.isSelected && (
        <SynthflowCalculator
          totalMinutes={state.totalMinutes}
          onPlanSelect={state.setSelectedSynthflowPlan}
        />
      )}

      {state.technologies.find((t) => t.id === "calcom")?.isSelected && (
        <CalcomCalculator 
          onPlanSelect={handleCalcomPlanSelect}
          totalMinutes={state.totalMinutes}
        />
      )}

      {state.technologies.find((t) => t.id === "twilio")?.isSelected && (
        <TwilioCalculator onRateSelect={state.setSelectedTwilioRate} />
      )}

      {state.technologies.find((t) => t.id === "vapi")?.isSelected && (
        <VapiCalculator />
      )}

      {state.technologies.find((t) => t.id === "blandai")?.isSelected && (
        <BlandAICalculator />
      )}
      
      {state.technologies.find((t) => t.id === "aiservice")?.isSelected && (
        <AIServiceCalculator />
      )}
    </div>
  );
}
