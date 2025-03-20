
import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory } from "@/types/invoice";
import { calculateTotalCostPerMinute } from "@/utils/calculationHelpers";
import { createInvoice, updateInvoice, formatInvoiceData } from "@/utils/invoiceOperations";
import { useCalculationToasts } from "./useCalculationToasts";
import { useState } from "react";

interface UseCalculationProps {
  technologies: any[];
  totalMinutes: number;
  margin: number;
  agencyInfo: any;
  clientInfo: any;
  taxRate: number;
  setTotalCost: (cost: number) => void;
  setSetupCost: (cost: number) => void;
  setShowPreview: (show: boolean) => void;
  callDuration: number;
  invoices: InvoiceHistory[];
  setInvoices: (invoices: InvoiceHistory[]) => void;
  editingInvoiceId: string | null;
  setShowTechStackWarning?: (show: boolean) => void;
}

export function useCalculation({
  technologies,
  totalMinutes,
  margin,
  agencyInfo,
  clientInfo,
  taxRate,
  setTotalCost,
  setSetupCost,
  setShowPreview,
  callDuration,
  invoices,
  setInvoices,
  editingInvoiceId,
  setShowTechStackWarning
}: UseCalculationProps) {
  const { 
    showSuccessToast, 
    showErrorToast, 
    showTechnologySelectionError 
  } = useCalculationToasts();

  const calculateCost = async () => {
    // Validate technology selection
    const selectedTechs = technologies.filter((tech) => tech.isSelected);
    if (selectedTechs.length === 0) {
      // Show toast notification
      showTechnologySelectionError();
      
      // Set visual warning in UI
      if (setShowTechStackWarning) {
        setShowTechStackWarning(true);
      }
      
      console.log("Technology stack warning triggered! No technologies selected.");
      return;
    }
    
    // Clear warning if technologies are selected
    if (setShowTechStackWarning) {
      setShowTechStackWarning(false);
    }

    console.log("===== COST CALCULATION START =====");
    console.log("Total minutes:", totalMinutes);
    console.log("Margin:", margin, "%");
    console.log("Selected technologies:", selectedTechs.length);
    
    // Log detailed information about each selected technology
    selectedTechs.forEach((tech, index) => {
      console.log(`[${index + 1}] ${tech.name} (${tech.id}): Monthly cost = ${tech.costPerMinute}$`);
    });
    
    // Calculate total cost of each technology
    let totalTechCost = 0;
    selectedTechs.forEach(tech => {
      console.log(`${tech.name} cost: ${tech.costPerMinute}$`);
      totalTechCost += tech.costPerMinute;
    });
    console.log("Total technology cost (without margin):", totalTechCost);
    
    // Calculate costs
    const { monthlyCost } = calculateTotalCostPerMinute(
      technologies,
      totalMinutes,
      margin
    );

    console.log("Final monthly cost:", monthlyCost);
    
    // Setup cost should be the same as monthly cost for consistency
    const setupCostValue = monthlyCost;
    console.log("Setup cost:", setupCostValue);
    console.log("===== COST CALCULATION END =====");
    
    // Update state with calculated costs
    setTotalCost(monthlyCost);
    setSetupCost(setupCostValue);
    setShowPreview(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (editingInvoiceId) {
          // Update existing invoice
          const { error } = await updateInvoice(
            editingInvoiceId,
            agencyInfo,
            clientInfo,
            setupCostValue,
            monthlyCost,
            taxRate,
            margin,
            totalMinutes,
            callDuration
          );
            
          if (error) {
            console.error('Error updating invoice:', error);
            showErrorToast(error.message, true);
          } else {
            // Update invoices in state
            const updatedInvoices = invoices.map((inv: InvoiceHistory) => 
              inv.id === editingInvoiceId ? {
                ...inv,
                agency_info: agencyInfo,
                client_info: clientInfo,
                setup_cost: setupCostValue,
                total_amount: monthlyCost,
                tax_rate: taxRate,
                margin: margin,
                total_minutes: totalMinutes,
                call_duration: callDuration,
                monthly_service_cost: monthlyCost,
                updated_at: new Date().toISOString()
              } : inv
            );
            
            setInvoices(updatedInvoices);
            showSuccessToast(true, true);
          }
        } else {
          // Create new invoice
          const { data, error } = await createInvoice(
            user.id,
            agencyInfo,
            clientInfo,
            setupCostValue,
            monthlyCost,
            taxRate,
            margin,
            totalMinutes,
            callDuration
          );
            
          if (error) {
            console.error('Error saving invoice:', error);
            showErrorToast("failedToSaveCalculation");
          } else if (data) {
            const newInvoiceData = formatInvoiceData(data[0]);
            setInvoices([...invoices, newInvoiceData]);
            showSuccessToast(true, false);
          }
        }
      } else {
        showSuccessToast(false, false);
      }
    } catch (error) {
      console.error('Error in calculation save:', error);
      showSuccessToast(false, false);
    }
  };

  return { calculateCost };
}
