
import { Technology } from "@/components/calculator/calculatorInitialState";

/**
 * Calculate the total cost per minute and monthly cost based on selected technologies and margin
 */
export function calculateTotalCostPerMinute(
  technologies: Technology[],
  totalMinutes: number,
  margin: number
) {
  const monthlyBaseCost = technologies
    .filter(tech => tech.isSelected)
    .reduce((acc, tech) => acc + tech.costPerMinute, 0);
  
  const totalMonthlyCost = monthlyBaseCost * (1 + margin / 100);
  
  const costPerMinute = totalMinutes > 0 ? totalMonthlyCost / totalMinutes : 0;
  
  return {
    monthlyCost: Math.ceil(totalMonthlyCost * 100) / 100,
    costPerMinute: Math.ceil(costPerMinute * 100000) / 100000
  };
}
