
import { useRef, useEffect } from "react";
import { InvoiceHistory } from "@/types/invoice";
import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";

interface InvoicePreviewDisplayProps {
  selectedInvoice: InvoiceHistory | null;
}

export function InvoicePreviewDisplay({ selectedInvoice }: InvoicePreviewDisplayProps) {
  const state = useCalculatorStateContext();
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Ensure the preview is visible when needed for export
  useEffect(() => {
    if (previewRef.current) {
      // Always render the preview, just control visibility with CSS
      previewRef.current.style.display = state.showPreview ? 'block' : 'none';
    }
  }, [state.showPreview, selectedInvoice]);

  return (
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
  );
}
