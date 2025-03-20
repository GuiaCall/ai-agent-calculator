
import { useState, useEffect, useRef } from "react";
import { CalcomPlan } from "@/types/calcom";
import { CALCOM_PLANS } from "@/constants/calcomPlans";
import { useToast } from "@/components/ui/use-toast";
import { useCalculatorStateContext } from "@/components/calculator/CalculatorStateContext";
import { useTranslation } from "react-i18next";

interface UseCalcomCalculatorProps {
  totalMinutes: number;
  onPlanSelect: (plan: CalcomPlan, numberOfUsers: number) => void;
  margin?: number;
  initialUsers?: number;
}

export function useCalcomCalculator({
  totalMinutes,
  onPlanSelect,
  margin = 20,
  initialUsers = 1
}: UseCalcomCalculatorProps) {
  const [selectedPlan, setSelectedPlan] = useState<CalcomPlan | null>(null);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(initialUsers);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const { toast } = useToast();
  const { currency } = useCalculatorStateContext();
  const { t } = useTranslation();
  const isInitialMount = useRef(true);
  const prevTotalMinutes = useRef(totalMinutes);

  // Initialize with the first plan on component mount
  useEffect(() => {
    if (CALCOM_PLANS.length > 0 && !selectedPlan) {
      setSelectedPlan(CALCOM_PLANS[0]);
      computeMonthlyCost(CALCOM_PLANS[0], numberOfUsers, false);
    }
  }, []);

  // Update the numberOfUsers state when the initialUsers prop changes
  useEffect(() => {
    if (initialUsers !== numberOfUsers) {
      setNumberOfUsers(initialUsers);
      if (selectedPlan) {
        computeMonthlyCost(selectedPlan, initialUsers, false);
      }
    }
  }, [initialUsers]);

  // Handle totalMinutes changes silently (without showing toast)
  useEffect(() => {
    if (!isInitialMount.current && prevTotalMinutes.current !== totalMinutes && selectedPlan) {
      computeMonthlyCost(selectedPlan, numberOfUsers, false);
    }
    
    prevTotalMinutes.current = totalMinutes;
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [totalMinutes]);

  const getCurrencyConversion = (amount: number): number => {
    switch (currency) {
      case 'EUR':
        return amount * 0.948231;
      default:
        return amount;
    }
  };

  const getCurrencySymbol = (curr: string = currency) => {
    switch (curr) {
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };

  const computeMonthlyCost = (plan: CalcomPlan | null = selectedPlan, users: number = numberOfUsers, showToast: boolean = true) => {
    if (!plan) {
      if (showToast) {
        toast({
          title: t("error"),
          description: t("pleaseSelectPlan"),
          variant: "destructive",
        });
      }
      return;
    }

    const teamMemberCost = (plan.allowsTeam && users > 0)
      ? users * (plan.pricePerUser || 0)
      : 0;
    
    const totalCost = plan.basePrice + teamMemberCost;
    setMonthlyTotal(totalCost);
    
    console.log(`Cal.com monthly cost computed: Base=${plan.basePrice}$, TeamMembers=${teamMemberCost}$, Total=${totalCost}$`);
    
    // Always call onPlanSelect to update the parent component's state with the FULL monthly cost
    const updatedPlan = {
      ...plan,
      costPerMinute: totalCost
    };
    onPlanSelect(updatedPlan, users);
    
    if (showToast) {
      toast({
        title: t("monthlyCostCalculated"),
        description: `${t("basePlanCost")}: ${getCurrencySymbol()}${getCurrencyConversion(plan.basePrice).toFixed(2)}
${t("teamMembersCost")}: ${getCurrencySymbol()}${getCurrencyConversion(teamMemberCost).toFixed(2)}
${t("totalCost")}: ${getCurrencySymbol()}${getCurrencyConversion(totalCost).toFixed(2)}`,
      });
    }

    return totalCost;
  };

  return {
    selectedPlan,
    setSelectedPlan,
    numberOfUsers,
    setNumberOfUsers,
    monthlyTotal,
    setMonthlyTotal,
    computeMonthlyCost,
    getCurrencyConversion,
    getCurrencySymbol
  };
}
