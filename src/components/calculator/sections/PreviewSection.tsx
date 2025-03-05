
import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { InvoiceHistoryTable } from "../InvoiceHistoryTable";
import { useCalculatorLogic } from "../CalculatorLogic";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";

export function PreviewSection() {
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleDeleteInvoice = (id: string) => {
    // Implement deletion logic here
    if (state.invoices) {
      const updatedInvoices = state.invoices.filter(invoice => invoice.id !== id);
      state.setInvoices(updatedInvoices);
      
      // Show toast notification
      toast({
        title: t("invoiceDeleted"),
        description: t("invoiceDeletedDescription"),
      });
    }
  };

  return (
    <div className="space-y-10">
      {state.showPreview && (
        <div id="invoice-preview">
          <CalculatorPreview
            showPreview={state.showPreview}
            agencyInfo={state.agencyInfo}
            clientInfo={state.clientInfo}
            totalMinutes={state.totalMinutes}
            totalCost={state.totalCost}
            setupCost={state.setupCost}
            taxRate={state.taxRate}
            themeColor={state.themeColor}
            currency={state.currency}
          />
        </div>
      )}
      
      {state.invoices && state.invoices.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("invoiceHistory")}</h3>
          <InvoiceHistoryTable 
            invoices={state.invoices}
            onExportPDF={logic.exportPDF}
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
