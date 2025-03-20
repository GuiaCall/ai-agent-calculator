
import { toast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory } from "@/types/invoice";

export function useExportPDF(invoices: InvoiceHistory[]) {
  const { t } = useTranslation();

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

    console.log("Starting PDF export process...", invoiceId ? `for invoice: ${invoiceId}` : "for current invoice");
    
    // Use the dedicated export preview element to avoid capturing the invoice history
    const exportElement = document.getElementById('export-invoice-preview');
    const regularElement = document.getElementById('invoice-preview');
    
    // Make sure at least one element exists
    if (!exportElement && !regularElement) {
      console.error('Invoice preview elements not found in DOM');
      toast({
        title: t("error"),
        description: t("previewNotFound"),
        variant: "destructive",
      });
      return;
    }
    
    // Prefer the export element, fall back to regular if needed
    const element = exportElement || regularElement;

    try {
      console.log("Found element, preparing to create PDF...");
      
      // Store the original display state
      const originalDisplay = element.style.display;
      const wasHidden = originalDisplay === 'none';
      
      // Force element to be visible and wait for DOM to update
      if (wasHidden) {
        console.log("Preview was hidden, making it visible for export");
        element.style.display = 'block';
      }
      
      // Add a temporary class for PDF export styling
      element.classList.add('pdf-export-mode');
      
      // Give DOM time to update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log("Capturing canvas...");
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        // Optimal dimensions for A4
        width: 793, // ~210mm at 96dpi
        height: 1122, // ~297mm at 96dpi
      });
      
      console.log("Canvas captured, dimensions:", canvas.width, "x", canvas.height);
      
      // Restore the original display state and remove temporary class
      if (wasHidden) {
        setTimeout(() => {
          element.style.display = originalDisplay;
          element.classList.remove('pdf-export-mode');
        }, 100);
      } else {
        element.classList.remove('pdf-export-mode');
      }
      
      // A4 dimensions in mm
      const imgWidth = 210;
      const pageHeight = 297;
      
      // Calculate height based on aspect ratio
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      console.log("Calculated dimensions for PDF:", imgWidth, "x", imgHeight);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Single page optimized approach - we're assuming our changes will make it fit on one page
      const imgData = canvas.toDataURL('image/png');
      
      // Add image to fit within A4 page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

      // Generate a unique filename
      const currentInvoice = targetInvoice || (invoices.length > 0 ? invoices[invoices.length - 1] : null);
      const invoiceNumber = currentInvoice?.invoice_number || `invoice-${new Date().toISOString()}`;
      
      console.log("Saving PDF with name:", `${invoiceNumber}.pdf`);
      
      // Force download
      pdf.save(`${invoiceNumber}.pdf`);

      // Update export timestamp in the database
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && currentInvoice) {
          const { error } = await supabase
            .from('invoices')
            .update({ last_exported_at: new Date().toISOString() })
            .eq('id', currentInvoice.id);

          if (error) {
            console.error('Error updating export timestamp:', error);
          }
        }
      } catch (dbError) {
        console.error('Database update error:', dbError);
        // Don't fail the export if database update fails
      }

      console.log("PDF export completed successfully");
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

  return { exportPDF };
}
