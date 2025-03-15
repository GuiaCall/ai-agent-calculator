
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

    console.log("Starting PDF export process...");
    
    // Make sure the element is rendered before accessing it
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ensure the preview element exists and is visible
    const element = document.getElementById('invoice-preview');
    if (!element) {
      console.error('Invoice preview element not found in DOM');
      toast({
        title: t("error"),
        description: t("previewNotFound"),
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Found element, preparing to create PDF...");
      
      // Force show the preview element during PDF generation
      const wasHidden = element.style.display === 'none';
      const originalDisplay = element.style.display;
      
      if (wasHidden) {
        console.log("Preview was hidden, making it visible for export");
        element.style.display = 'block';
      }
      
      // Allow the DOM to update before capturing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log("Capturing canvas...");
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        windowWidth: 1200,
        windowHeight: element.scrollHeight,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      console.log("Canvas captured, dimensions:", canvas.width, "x", canvas.height);
      
      // Restore the element's original display state
      if (wasHidden) {
        element.style.display = originalDisplay;
      }
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      console.log("Calculated dimensions for PDF:", imgWidth, "x", imgHeight);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Check if we need multiple pages
      const pagesNeeded = Math.ceil(imgHeight / pageHeight);
      console.log("Pages needed:", pagesNeeded);
      
      if (pagesNeeded <= 1) {
        // Single page - simpler case
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages
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
      }

      // Generate a unique filename
      const currentInvoice = targetInvoice || (invoices.length > 0 ? invoices[invoices.length - 1] : null);
      const invoiceNumber = currentInvoice?.invoice_number || `invoice-${new Date().toISOString()}`;
      
      console.log("Saving PDF with name:", `${invoiceNumber}.pdf`);
      
      // Use a consistent method to trigger download
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
