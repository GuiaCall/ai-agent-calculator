
import { MakeCalculator } from "./make/MakeCalculator";
import { SynthflowCalculator } from "../SynthflowCalculator";
import { CalcomCalculator } from "../CalcomCalculator";
import { TwilioCalculator } from "../TwilioCalculator";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { CalcomPlan } from "@/types/calcom";

export function TechnologyCalculators() {
  const state = useCalculatorStateContext();

  const handleCalcomPlanSelect = (plan: CalcomPlan, users: number) => {
    state.setSelectedCalcomPlan(plan);
    state.setNumberOfUsers(users);
    if (plan.costPerMinute !== undefined) {
      state.setTechnologies((techs) =>
        techs.map((tech) =>
          tech.id === "calcom" ? { ...tech, costPerMinute: plan.costPerMinute || 0 } : tech
        )
      );
    }
  };

  return (
    <>
      {state.technologies.find((t) => t.id === "make")?.isSelected && (
        <MakeCalculator
          totalMinutes={state.totalMinutes}
          averageCallDuration={state.callDuration}
          onPlanSelect={state.setSelectedMakePlan}
          onCostPerMinuteChange={(cost) => {
            state.setTechnologies((techs) =>
              techs.map((tech) =>
                tech.id === "make" ? { ...tech, costPerMinute: cost } : tech
              )
            );
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
    </>
  );
}
