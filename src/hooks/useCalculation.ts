import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory, ClientInfo, AgencyInfo } from "@/types/invoice";
import { safelyParseJSON } from "@/utils/jsonUtils";

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
  editingInvoiceId
}: UseCalculationProps) {
  const { t } = useTranslation();

  const calculateCost = async () => {
    const selectedTechs = technologies.filter((tech) => tech.isSelected);
    if (selectedTechs.length === 0) {
      toast({
        title: t("error"),
        description: t("pleaseSelectAtLeastOneTechnology"),
        variant: "destructive",
      });
      return;
    }

    const { monthlyCost } = calculateTotalCostPerMinute(
      technologies,
      totalMinutes,
      margin
    );

    const setupCostValue = monthlyCost;
    
    setTotalCost(monthlyCost);
    setSetupCost(setupCostValue);
    setShowPreview(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (editingInvoiceId) {
          const { error } = await supabase
            .from('invoices')
            .update({
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
            })
            .eq('id', editingInvoiceId);
            
          if (error) {
            console.error('Error updating invoice:', error);
            toast({
              title: t("error"),
              description: t("failedToUpdateInvoice"),
              variant: "destructive",
            });
          } else {
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
            
            toast({
              title: t("success"),
              description: t("invoiceUpdatedSuccessfully"),
            });
          }
        } else {
          const currentYear = 2025;
          let nextSequence = 1;
          
          const yearInvoices = invoices.filter((inv: InvoiceHistory) => 
            inv.invoice_number.includes(`INV-${currentYear}`)
          );
          
          if (yearInvoices.length > 0) {
            const sequences = yearInvoices.map((inv: InvoiceHistory) => {
              const seqStr = inv.invoice_number.split('-')[2];
              return parseInt(seqStr, 10);
            });
            nextSequence = Math.max(...sequences) + 1;
          }
          
          const invoiceNumber = `INV-${currentYear}-${nextSequence.toString().padStart(6, '0')}`;
          
          const newInvoice = {
            user_id: user.id,
            agency_info: agencyInfo,
            client_info: clientInfo,
            setup_cost: setupCostValue,
            total_amount: monthlyCost,
            tax_rate: taxRate,
            margin: margin,
            total_minutes: totalMinutes,
            call_duration: callDuration,
            invoice_number: invoiceNumber,
            monthly_service_cost: monthlyCost
          };
          
          const { data, error } = await supabase
            .from('invoices')
            .insert(newInvoice)
            .select();
            
          if (error) {
            console.error('Error saving invoice:', error);
            toast({
              title: t("error"),
              description: t("failedToSaveCalculation"),
              variant: "destructive",
            });
          } else if (data) {
            // Parse the JSON data from Supabase before adding to invoices array
            const newInvoiceData = {
              ...data[0],
              agency_info: safelyParseJSON(data[0].agency_info, {}),
              client_info: safelyParseJSON(data[0].client_info, {})
            } as InvoiceHistory;
            
            setInvoices([...invoices, newInvoiceData]);
            
            toast({
              title: t("success"),
              description: t("costCalculationCompletedAndSaved"),
            });
          }
        }
      } else {
        toast({
          title: t("success"),
          description: t("costCalculationCompleted"),
        });
      }
    } catch (error) {
      console.error('Error in calculation save:', error);
      toast({
        title: t("success"),
        description: t("costCalculationCompleted"),
      });
    }
  };

  return { calculateCost };
}

function calculateTotalCostPerMinute(
  technologies: any[],
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
