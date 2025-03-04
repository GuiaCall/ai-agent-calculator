
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";

export const calculateCalcomCostPerMinute = (
  plan: CalcomPlan | null,
  numberOfUsers: number,
  totalMinutes: number
): number => {
  if (!plan || totalMinutes <= 0) return 0;
  
  // Calculate team member cost
  const teamMemberCost = (plan.name === "Team" || plan.name === "Organization") && numberOfUsers > 0
    ? numberOfUsers * 12 // $12 per team member
    : 0;
  
  // Calculate total monthly cost including team members
  const monthlyTotal = plan.basePrice + teamMemberCost;
  
  // Return the monthly cost (not the cost per minute)
  return monthlyTotal;
};

export const calculateTwilioCostPerMinute = (selection: TwilioSelection | null, totalMinutes: number): number => {
  if (!selection) return 0;
  
  // Calculate the total monthly cost
  const totalCostPerMinute = selection.inboundVoicePrice;
  const monthlyCost = (totalMinutes * totalCostPerMinute) + selection.phoneNumberPrice;
  
  return monthlyCost;
};

export const calculateSetupCost = (
  makePlanCost: number,
  synthflowPlanCost: number,
  calcomPlanCost: number,
  twilioPhoneNumberCost: number
): number => {
  return Math.ceil(makePlanCost + synthflowPlanCost + calcomPlanCost + twilioPhoneNumberCost);
};

export const calculateTotalCostPerMinute = (
  technologies: Array<{ id: string; isSelected: boolean; costPerMinute: number }>,
  totalMinutes: number,
  margin: number
): { monthlyCost: number, costPerMinute: number } => {
  // Sum up the monthly costs from all selected technologies
  const monthlyBaseCost = technologies
    .filter(tech => tech.isSelected)
    .reduce((acc, tech) => acc + tech.costPerMinute, 0);
  
  // Apply margin to the monthly cost
  const totalMonthlyCost = monthlyBaseCost * (1 + margin / 100);
  
  // Calculate cost per minute
  const costPerMinute = totalMinutes > 0 ? totalMonthlyCost / totalMinutes : 0;
  
  return {
    monthlyCost: Math.ceil(totalMonthlyCost * 100) / 100,  // Round to 2 decimal places
    costPerMinute: Math.ceil(costPerMinute * 100000) / 100000  // Round to 5 decimal places
  };
};
