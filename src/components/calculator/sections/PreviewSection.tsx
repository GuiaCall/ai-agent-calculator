
import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { InvoiceHistoryTable } from "../InvoiceHistoryTable";
import { useCalculatorLogic } from "../CalculatorLogic";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function PreviewSection() {
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const { t } = useTranslation();
  const { toast } = useToast();

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
