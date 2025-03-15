
import { InvoicePreview } from "../InvoicePreview";
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { CurrencyType } from "./CalculatorState";

interface CalculatorPreviewProps {
  showPreview: boolean;
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
  totalMinutes: number;
  totalCost: number | null;
  setupCost: number | null;
  taxRate: number;
  themeColor: string;
  currency: CurrencyType;
  invoiceNumber?: string;
}

export function CalculatorPreview({
  showPreview,
  agencyInfo,
  clientInfo,
  totalMinutes,
  totalCost,
  setupCost,
  taxRate,
  themeColor,
  currency,
  invoiceNumber,
}: CalculatorPreviewProps) {
  // Always render the component, but control visibility with CSS
  if (!totalCost) return null;

  return (
    <div className="invoice-preview-container">
      <InvoicePreview
        agencyInfo={agencyInfo}
        clientInfo={clientInfo}
        totalMinutes={totalMinutes}
        totalCost={totalCost}
        setupCost={setupCost}
        taxRate={taxRate}
        themeColor={themeColor}
        currency={currency}
        invoiceNumber={invoiceNumber}
      />
    </div>
  );
}
