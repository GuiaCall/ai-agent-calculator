
import { CalcomPlan } from "@/types/calcom";
import { Technology } from "@/components/calculator/calculatorInitialState";

export function useTechnologyHandlers(setTechnologies: (technologies: Technology[] | ((prevTechs: Technology[]) => Technology[])) => void) {
  const handleCalcomPlanSelect = (plan: CalcomPlan, users: number) => {
    const monthlyTotal = plan.basePrice + (plan.allowsTeam ? (users - 1) * plan.pricePerUser : 0);
    const costPerMinute = monthlyTotal;
    
    setTechnologies((techs: Technology[]) => 
      techs.map(tech => 
        tech.id === "calcom" ? { ...tech, costPerMinute } : tech
      )
    );
  };

  const handleTwilioRateSelect = (selection: any | null) => {
    if (selection) {
      const costPerMinute = Math.ceil((selection.inboundVoicePrice + (selection.inboundSmsPrice || 0)) * 1000) / 1000;
      
      setTechnologies((techs: Technology[]) => 
        techs.map(tech => 
          tech.id === "twilio" ? { ...tech, costPerMinute } : tech
        )
      );
    }
  };

  return {
    handleCalcomPlanSelect,
    handleTwilioRateSelect
  };
}
