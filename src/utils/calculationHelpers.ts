
import { Technology } from "@/types/invoice";

/**
 * Calculate the total cost per minute and monthly cost based on selected technologies and margin
 */
export function calculateTotalCostPerMinute(
  technologies: Technology[],
  totalMinutes: number,
  margin: number
) {
  // Filter selected technologies for better logs
  const selectedTechs = technologies.filter(tech => tech.isSelected);
  
  console.log("========== CALCULATING TOTAL COST ==========");
  console.log(`Selected technologies (${selectedTechs.length}):`, selectedTechs.map(t => t.name));
  
  // Calculate the sum of all monthly costs from selected technologies
  const monthlyBaseCost = selectedTechs.reduce((acc, tech) => {
    // Log each technology's cost for debugging
    console.log(`Technology ${tech.name}: Monthly cost = ${tech.costPerMinute}$`);
    return acc + tech.costPerMinute;
  }, 0);

  console.log("Technologies selected:", selectedTechs.map(t => `${t.name}: ${t.costPerMinute}$`));
  console.log("Base monthly cost (without margin):", monthlyBaseCost);
  
  // Apply margin to the monthly cost
  const totalMonthlyCost = monthlyBaseCost * (1 + margin / 100);
  console.log("Total monthly cost (with margin):", totalMonthlyCost);
  
  // Calculate cost per minute
  const costPerMinute = totalMinutes > 0 ? totalMonthlyCost / totalMinutes : 0;
  console.log("Cost per minute:", costPerMinute);
  
  return {
    monthlyCost: Math.ceil(totalMonthlyCost * 100) / 100,  // Round to 2 decimal places
    costPerMinute: Math.ceil(costPerMinute * 100000) / 100000  // Round to 5 decimal places
  };
}
