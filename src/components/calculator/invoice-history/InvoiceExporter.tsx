
import { useRef, useEffect } from "react";
import { InvoiceHistory } from "@/types/invoice";
import { CalculatorPreview } from "../CalculatorPreview";
import { useCalculatorStateContext } from "../CalculatorStateContext";

interface InvoiceExporterProps {
  selectedInvoice: InvoiceHistory | null;
}

export function InvoiceExporter({ selectedInvoice }: InvoiceExporterProps) {
  const state = useCalculatorStateContext();
  const exportPreviewRef = useRef<HTMLDivElement>(null);
  
  // Ensure the export preview is hidden by default
  useEffect(() => {
    if (exportPreviewRef.current) {
      exportPreviewRef.current.style.display = 'none';
    }
  }, []);

  return (
    <div 
      id="export-invoice-preview" 
      ref={exportPreviewRef}
      style={{ display: 'none' }}
      className="print:block max-w-[210mm] mx-auto" // Always show when printing and center
    >
      <CalculatorPreview
        showPreview={true}
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
