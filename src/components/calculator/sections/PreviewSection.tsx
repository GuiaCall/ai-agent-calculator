
import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { InvoiceHistoryTable } from "../InvoiceHistoryTable";
import { useCalculatorLogic } from "../CalculatorLogic";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { InvoiceHistory } from "@/types/invoice";

export function PreviewSection() {
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const { t } = useTranslation();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceHistory | null>(null);

  // Ensure the preview is visible when needed for export
  useEffect(() => {
    if (previewRef.current) {
      // Always render the preview, just control visibility with CSS
      previewRef.current.style.display = state.showPreview ? 'block' : 'none';
    }
  }, [state.showPreview, selectedInvoice]);

  // Reset the selected invoice when editing is canceled
  useEffect(() => {
    if (!state.editingInvoice) {
      setSelectedInvoice(null);
    }
  }, [state.editingInvoice]);

  const handleDeleteInvoice = async (id: string) => {
    try {
      // Update the database - set is_deleted to true
      const { error } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      if (state.invoices) {
        const updatedInvoices = state.invoices.filter(invoice => invoice.id !== id);
        state.setInvoices(updatedInvoices);
      }
      
      // Show toast notification
      toast({
        title: t("invoiceDeleted"),
        description: t("invoiceDeletedDescription"),
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: t("error"),
        description: t("errorDeletingInvoice"),
        variant: "destructive",
      });
    }
  };

  // Handle exporting a specific invoice
  const handleExportInvoice = (invoiceId: string) => {
    // Find the invoice from the list
    if (state.invoices) {
      const invoice = state.invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        // Show the invoice in the preview
        setSelectedInvoice(invoice);
        
        // Force the preview to be visible
        if (previewRef.current) {
          previewRef.current.style.display = 'block';
        }
        
        // Trigger export after a short delay to ensure DOM update
        setTimeout(() => {
          logic.exportPDF(invoiceId);
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div 
        id="invoice-preview" 
        ref={previewRef}
        style={{ display: state.showPreview ? 'block' : 'none' }}
        className="print:block" // Always show when printing
      >
        <CalculatorPreview
          showPreview={true} // Always pass true here to ensure rendering
          agencyInfo={selectedInvoice?.agency_info || state.agencyInfo}
          clientInfo={selectedInvoice?.client_info || state.clientInfo}
          totalMinutes={selectedInvoice?.total_minutes || state.totalMinutes}
          totalCost={selectedInvoice?.total_amount || state.totalCost}
          setupCost={selectedInvoice?.setup_cost || state.setupCost}
          taxRate={selectedInvoice?.tax_rate || state.taxRate}
          themeColor={state.themeColor}
          currency={state.currency}
          invoiceNumber={selectedInvoice?.invoice_number || state.editingInvoice?.invoice_number}
          callDuration={selectedInvoice?.call_duration || state.callDuration}
          technologies={state.technologies}
        />
      </div>
      
      {state.invoices && state.invoices.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("invoiceHistory")}</h3>
          <InvoiceHistoryTable 
            invoices={state.invoices}
            onExportPDF={handleExportInvoice}
            onStartEdit={logic.startEdit}
            onCancelEdit={logic.cancelEdit}
            onDeleteInvoice={handleDeleteInvoice}
            editingInvoiceId={state.editingInvoiceId}
            currency={state.currency}
          />
        </div>
      )}
    </div>
  );
}
