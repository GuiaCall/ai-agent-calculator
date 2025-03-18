
import { agency } from './agency';
import { auth } from './auth';
import { calculator } from './calculator';
import { client } from './client';
import { dashboard } from './dashboard';
import { general } from './general';
import { invoice } from './invoice';
import { legal } from './legal';
import { technologies } from './technologies';
import { ui } from './ui';

export const en = {
  translation: {
    ...auth,
    ...general,
    ...ui,
    ...agency,
    ...client,
    ...calculator,
    ...invoice,
    ...dashboard,
    ...legal,
    ...technologies,
    
    // Disclaimer translations
    disclaimerText: "Please note that all calculations provided are approximations. Actual costs may vary based on specific usage patterns, provider pricing changes, and other factors.",
    disclaimerAccept: "I understand that these are approximate calculations",
    
    // Additional translation keys
    technologies: "Technologies",
    
    // Technology section messages
    noTechnologySelected: "No Technology Stack Selected",
    selectTechnologyMessage: "Please select at least one Technology Stack.",
    
    // Synthflow usage summary
    costBreakdown: "Cost Breakdown",
    planAllowance: "Plan Allowance",
    planBaseCost: "Plan Base Cost",
    overageMinutes: "Overage Minutes",
    overageCost: "Overage Cost",
    totalCost: "Total Cost",
    minutes: "minutes",
    
    // Cal.com calculator
    basePlanCost: "Base Plan Cost",
    teamMembersCost: "Team Members Cost",
    costPerMinute: "Cost Per Minute",
    numberOfTeamMembers: "Number of Team Members",
    teamMembersCostInfo: "Each additional team member costs {{cost}} per month",
    pleaseSelectPlan: "Please select a plan",
    computeMonthlyCost: "Compute Monthly Cost",
    monthlyCostCalculated: "Monthly Cost Calculated"
  }
};
