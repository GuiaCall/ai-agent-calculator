
import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";
import { InvoiceHistoryTable } from "../InvoiceHistoryTable";
import { useCalculatorLogic } from "../CalculatorLogic";

export function PreviewSection() {
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });

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
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Invoice History</h3>
          <InvoiceHistoryTable 
            invoices={state.invoices}
            onExportPDF={logic.exportPDF}
            onStartEdit={logic.startEdit}
            onCancelEdit={logic.cancelEdit}
            editingInvoiceId={state.editingInvoiceId}
            currency={state.currency}
          />
        </div>
      )}
    </div>
  );
}
