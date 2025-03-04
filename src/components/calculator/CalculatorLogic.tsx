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
  setShowPreview,
  callDuration
}: any) {
  const { toast } = useToast();

  const calculateCost = async () => {
    const selectedTechs = technologies.filter((tech) => tech.isSelected);
    if (selectedTechs.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one technology",
        variant: "destructive",
      });
      return;
    }

    // Calculate the total cost from all technology parameters
    const { monthlyCost, costPerMinute } = calculateTotalCostPerMinute(
      technologies,
      totalMinutes,
      margin
    );

    // Set the setup cost to be equal to the monthly cost
    const setupCostValue = monthlyCost;
    
    setTotalCost(monthlyCost);
    setSetupCost(setupCostValue);
    setShowPreview(true);

    try {
      // Save the calculation to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Generate a simple invoice number based on timestamp and user
        const timestamp = new Date().getTime().toString().slice(-6);
        const userFragment = user.id.substring(0, 4);
        const invoiceNumber = `INV-${userFragment}-${timestamp}`;
        
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
            title: "Error",
            description: "Failed to save calculation to your account",
            variant: "destructive",
          });
        } else if (data) {
          // Add the new invoice to the local state
          setInvoices([...invoices, data[0]]);
          
          toast({
            title: "Success",
            description: "Cost calculation completed and saved",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Cost calculation completed",
        });
      }
    } catch (error) {
      console.error('Error in calculation save:', error);
      toast({
        title: "Success",
        description: "Cost calculation completed",
      });
    }
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
        scale: 2,
        useCORS: true,
        logging: true,
        windowWidth: 1200,
        windowHeight: element.scrollHeight
      });
      
      // Calculate dimensions to fit on A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF with proper orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate number of pages needed
      const pagesNeeded = Math.ceil(imgHeight / pageHeight);
      
      // Split the canvas into pages
      for (let page = 0; page < pagesNeeded; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the image to use for this page
        const sourceY = page * canvas.height / pagesNeeded;
        const sourceHeight = canvas.height / pagesNeeded;
        
        // Create a temporary canvas for this portion
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );
        }
        
        // Add this portion to the PDF
        const imgData = tempCanvas.toDataURL('image/png');
        pdf.addImage(
          imgData,
          'PNG',
          0,
          0,
          imgWidth,
          (sourceHeight * imgWidth) / canvas.width
        );
      }

      pdf.save(`invoice-${new Date().toISOString()}.pdf`);

      // Update last_exported_at in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user && invoices.length > 0) {
        const latestInvoice = invoices[invoices.length - 1];
        const { error } = await supabase
          .from('invoices')
          .update({ last_exported_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('id', latestInvoice.id);

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
