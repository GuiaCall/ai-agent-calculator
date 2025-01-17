import { useToast } from "@/hooks/use-toast";
import { CalcomPlan } from "@/types/calcom";
import { TwilioSelection } from "@/types/twilio";
import { InvoiceHistory } from "@/types/invoice";
import {
  calculateCalcomCostPerMinute,
  calculateTwilioCostPerMinute,
  calculateSetupCost,
  calculateTotalCostPerMinute,
} from "@/utils/costCalculations";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from "@/integrations/supabase/client";

export function useCalculatorLogic({
  technologies,
  setTechnologies,
  selectedMakePlan,
  selectedSynthflowPlan,
  selectedCalcomPlan,
  selectedTwilioRate,
  numberOfUsers,
  totalMinutes,
  margin,
  setTotalCost,
  setSetupCost,
  clientInfo,
  agencyInfo,
  taxRate,
  invoices,
  setInvoices,
  currency,
  setShowPreview
}: any) {
  const { toast } = useToast();

  const calculateCost = () => {
    const selectedTechs = technologies.filter((tech) => tech.isSelected);
    if (selectedTechs.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one technology",
        variant: "destructive",
      });
      return;
    }

    // Calculate setup costs
    const makeSetupCost = selectedMakePlan?.monthlyPrice || 0;
    const synthflowSetupCost = selectedSynthflowPlan?.monthlyPrice || 0;
    const calcomSetupCost = selectedCalcomPlan 
      ? (selectedCalcomPlan.basePrice + (selectedCalcomPlan.allowsTeam ? (numberOfUsers - 1) * selectedCalcomPlan.pricePerUser : 0))
      : 0;
    const twilioSetupCost = (selectedTwilioRate?.phoneNumberPrice || 0) * 2; // 2 months of phone number cost

    const totalSetupCost = (makeSetupCost + synthflowSetupCost + calcomSetupCost + twilioSetupCost) * (1 + margin / 100);

    const updatedTechnologies = technologies.map(tech => {
      switch (tech.id) {
        case 'make':
          if (selectedMakePlan) {
            const costPerMinute = calculateCalcomCostPerMinute(selectedCalcomPlan, numberOfUsers, totalMinutes);
            return { ...tech, costPerMinute };
          }
          break;
        case 'calcom':
          if (selectedCalcomPlan) {
            const costPerMinute = calculateCalcomCostPerMinute(selectedCalcomPlan, numberOfUsers, totalMinutes);
            return { ...tech, costPerMinute };
          }
          break;
        case 'twilio':
          if (selectedTwilioRate) {
            const costPerMinute = calculateTwilioCostPerMinute(selectedTwilioRate);
            return { ...tech, costPerMinute };
          }
          break;
      }
      return tech;
    });

    setTechnologies(updatedTechnologies);

    const finalCostPerMinute = calculateTotalCostPerMinute(updatedTechnologies, margin);
    const finalCost = finalCostPerMinute * totalMinutes;
    
    setTotalCost(finalCost);
    setSetupCost(totalSetupCost);
    setShowPreview(true);

    toast({
      title: "Success",
      description: "Cost calculation completed",
    });
  };

  const handleCalcomPlanSelect = (plan: CalcomPlan, users: number) => {
    const monthlyTotal = plan.basePrice + (plan.allowsTeam ? (users - 1) * plan.pricePerUser : 0);
    const costPerMinute = totalMinutes > 0 ? Math.ceil((monthlyTotal / totalMinutes) * 1000) / 1000 : 0;
    
    setTechnologies(techs => 
      techs.map(tech => 
        tech.id === 'calcom' ? { ...tech, costPerMinute } : tech
      )
    );
  };

  const handleTwilioRateSelect = (selection: TwilioSelection | null) => {
    if (selection) {
      const costPerMinute = Math.ceil((selection.inboundVoicePrice + (selection.inboundSmsPrice || 0)) * 1000) / 1000;
      
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'twilio' ? { ...tech, costPerMinute } : tech
        )
      );
    }
  };

  const handleEdit = (invoice: InvoiceHistory, setEditingId: (id: string) => void, setRecalculatedId: (id: string) => void) => {
    setEditingId(invoice.id);
    calculateCost();
    setRecalculatedId(invoice.id);
  };

  const handleSave = (invoice: InvoiceHistory, setEditingId: (id: string) => void, setRecalculatedId: (id: string) => void) => {
    const updatedInvoices = invoices.map((inv: InvoiceHistory) =>
      inv.id === invoice.id ? { ...inv, total_amount: invoice.total_amount } : inv
    );
    setInvoices(updatedInvoices);
    setEditingId('');
    setRecalculatedId('');
    toast({
      title: "Success",
      description: "Invoice updated successfully",
    });
  };

  const exportPDF = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element) {
      toast({
        title: "Error",
        description: "Preview not found. Please calculate cost first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Increase quality
        useCORS: true,
        logging: true,
        windowWidth: 1200, // Set a fixed width for consistency
        windowHeight: element.scrollHeight
      });
      
      // Calculate dimensions to fit on A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate positioning to center the content
      const xPosition = 0;
      const yPosition = 0;
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        xPosition,
        yPosition,
        imgWidth,
        imgHeight
      );

      pdf.save(`invoice-${new Date().toISOString()}.pdf`);

      // Update last_exported_at in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('invoices')
          .update({ last_exported_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('id', invoices[invoices.length - 1].id);

        if (error) {
          console.error('Error updating export timestamp:', error);
        }
      }

      toast({
        title: "Success",
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleCalcomPlanSelect,
    handleTwilioRateSelect,
    calculateCost,
    handleEdit,
    handleSave,
    exportPDF,
  };
}
