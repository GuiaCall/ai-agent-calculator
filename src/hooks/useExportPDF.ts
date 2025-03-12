
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
      
      const imgWidth = 210;
      const pageHeight = 297;
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

  return { exportPDF };
}
