
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
      
      // Give DOM time to update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log("Capturing canvas...");
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      console.log("Canvas captured, dimensions:", canvas.width, "x", canvas.height);
      
      // Restore the original display state
      if (wasHidden) {
        setTimeout(() => {
          element.style.display = originalDisplay;
        }, 100);
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
        // Single page
        const imgData = canvas.toDataURL('image/png');
        // Center the image on the page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages - improved page breaking with proper margins
        let heightLeft = imgHeight;
        let position = 0;
        let page = 0;
        
        while (heightLeft > 0) {
          // Add a new page after the first page
          if (page > 0) {
            pdf.addPage();
          }
          
          // Calculate how much to print on this page
          const heightToPrint = Math.min(heightLeft, pageHeight);
          
          // Create a temporary canvas for each page section
          const tempCanvas = document.createElement('canvas');
          const tempContext = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = (heightToPrint / imgHeight) * canvas.height;
          
          if (tempContext) {
            // Draw the relevant portion of the original canvas
            tempContext.drawImage(
              canvas,
              0,
              (position / imgHeight) * canvas.height, // y position to start copying from
              canvas.width,
              (heightToPrint / imgHeight) * canvas.height, // height to copy
              0,
              0,
              tempCanvas.width,
              tempCanvas.height
            );
            
            const imgData = tempCanvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, heightToPrint);
          }
          
          // Move to next page position
          heightLeft -= pageHeight;
          position += pageHeight;
          page++;
        }
      }

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

