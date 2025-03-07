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
import { supabase, logSupabaseResponse } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

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
  callDuration,
  setEditingInvoice,
  isEditingInvoice,
  editingInvoiceId
}: any) {
  const { toast } = useToast();
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

    const { monthlyCost, costPerMinute } = calculateTotalCostPerMinute(
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
      if (!user) {
        console.log("Cannot save invoice: No authenticated user");
        toast({
          title: t("warning"),
          description: t("loginToSaveInvoices"),
        });
        return;
      }
      
      console.log("Saving invoice for user:", user.id);

      if (isEditingInvoice && editingInvoiceId) {
        console.log("Updating existing invoice:", editingInvoiceId);
        
        const invoiceData = {
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
        };
        
        console.log("Invoice update data:", invoiceData);
        
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingInvoiceId);
          
        if (error) {
          console.error('Error updating invoice:', error);
          toast({
            title: t("error"),
            description: t("failedToUpdateInvoice"),
            variant: "destructive",
          });
        } else {
          console.log("Invoice updated successfully");
          
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
          monthly_service_cost: monthlyCost,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Creating new invoice:", newInvoice);
        
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
          console.log("Invoice created successfully:", data[0]);
          
          setInvoices([...invoices, data[0]]);
          
          toast({
            title: t("success"),
            description: t("costCalculationCompletedAndSaved"),
          });
        }
      }
    } catch (error) {
      console.error('Error in calculation save:', error);
      toast({
        title: t("error"),
        description: t("errorSavingData"),
        variant: "destructive",
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

  const cancelEdit = () => {
    setEditingInvoice(null);
  };

  const startEdit = (invoice: InvoiceHistory) => {
    setEditingInvoice(invoice);
  };

  const exportPDF = async (invoiceId?: string) => {
    let targetInvoice: InvoiceHistory | undefined;
    if (invoiceId) {
      targetInvoice = invoices.find((inv: InvoiceHistory) => inv.id === invoiceId);
      if (!targetInvoice) {
        toast({
          title: t("error"),
          description: t("invoiceNotFound"),
          variant: "destructive",
        });
        return;
      }
    }

    const element = document.getElementById('invoice-preview');
    if (!element) {
      toast({
        title: t("error"),
        description: t("previewNotFound"),
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
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pagesNeeded = Math.ceil(imgHeight / pageHeight);
      
      for (let page = 0; page < pagesNeeded; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        const sourceY = page * canvas.height / pagesNeeded;
        const sourceHeight = canvas.height / pagesNeeded;
        
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

      const currentInvoice = targetInvoice || (invoices.length > 0 ? invoices[invoices.length - 1] : null);
      const invoiceNumber = currentInvoice?.invoice_number || `invoice-${new Date().toISOString()}`;
      pdf.save(`${invoiceNumber}.pdf`);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && currentInvoice) {
        const { error } = await supabase
          .from('invoices')
          .update({ last_exported_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('id', currentInvoice.id);

        if (error) {
          console.error('Error updating export timestamp:', error);
        }
      }

      toast({
        title: t("success"),
        description: t("pdfExportedSuccessfully"),
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: t("error"),
        description: t("failedToExportPDF"),
        variant: "destructive",
      });
    }
  };

  return {
    handleCalcomPlanSelect,
    handleTwilioRateSelect,
    calculateCost,
    startEdit,
    cancelEdit,
    exportPDF,
  };
}
