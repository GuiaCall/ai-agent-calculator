
import { useState, useEffect } from "react";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { useCalculatorLogic } from "../CalculatorLogic";
import { InvoiceHistoryTable } from "../invoice-history/InvoiceHistoryTable";
import { InvoiceHistory } from "@/types/invoice";
import { InvoicePreviewDisplay } from "../invoice-history/InvoicePreviewDisplay";
import { InvoiceExporter } from "../invoice-history/InvoiceExporter";
import { useInvoiceDeletion } from "@/hooks/useInvoiceDeletion";
import { useTranslation } from "react-i18next";

export function PreviewSection() {
  const { t } = useTranslation();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceHistory | null>(null);
  const { handleDeleteInvoice } = useInvoiceDeletion(state.invoices, state.setInvoices);

  // Reset the selected invoice when editing is canceled
  useEffect(() => {
    if (!state.editingInvoice) {
      setSelectedInvoice(null);
    }
  }, [state.editingInvoice]);

  // Handle exporting a specific invoice
  const handleExportInvoice = (invoiceId: string) => {
    // Find the invoice from the list
    if (state.invoices) {
      const invoice = state.invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        // Show the invoice in the preview
        setSelectedInvoice(invoice);
        
        // Trigger export after a short delay to ensure DOM update
        setTimeout(() => {
          logic.exportPDF(invoiceId);
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Regular preview that's shown in the UI */}
      <InvoicePreviewDisplay selectedInvoice={selectedInvoice} />
      
      {/* Hidden preview only used for export to PDF - no invoice history included */}
      <InvoiceExporter selectedInvoice={selectedInvoice} />
      
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
