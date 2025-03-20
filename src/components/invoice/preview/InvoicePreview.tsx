
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import { useTranslation } from "react-i18next";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceBillingInfo } from "./InvoiceBillingInfo";
import { InvoiceServiceDetails } from "./InvoiceServiceDetails";
import { InvoiceTechnologyStack } from "./InvoiceTechnologyStack";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { InvoiceTotals } from "./InvoiceTotals";
import { InvoiceFooter } from "./InvoiceFooter";

interface InvoicePreviewProps {
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
  totalMinutes: number;
  totalCost: number | null;
  setupCost: number | null;
  taxRate: number;
  themeColor: string;
  currency: CurrencyType;
  invoiceNumber?: string;
  callDuration?: number;
  technologies?: { name: string; isSelected: boolean }[];
}

export function InvoicePreview({
  agencyInfo,
  clientInfo,
  totalMinutes,
  totalCost,
  setupCost,
  taxRate,
  themeColor,
  currency,
  invoiceNumber,
  callDuration = 0,
  technologies = [],
}: InvoicePreviewProps) {
  const { t } = useTranslation();
  
  const getCurrencySymbol = (currency: CurrencyType) => {
    switch (currency) {
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };
  
  const currencySymbol = getCurrencySymbol(currency);
  const costPerMinute = totalCost && totalMinutes ? totalCost / totalMinutes : 0;
  const taxAmount = (totalCost || 0) * (taxRate / 100);
  const total = (totalCost || 0) * (1 + taxRate / 100) + (setupCost || 0);
  
  const currentYear = new Date().getFullYear();
  const dynamicInvoiceNumber = invoiceNumber || `INV-${currentYear}-0001`;

  // Don't render if there's no total cost
  if (!totalCost) return null;

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full print:scale-90 print:my-0">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white print:break-inside-avoid">
        <InvoiceHeader 
          invoiceNumber={dynamicInvoiceNumber} 
          agencyInfo={agencyInfo} 
        />
      </div>
      
      <div className="p-6 bg-white print:text-sm">
        <InvoiceBillingInfo 
          clientInfo={clientInfo} 
          total={total} 
          currencySymbol={currencySymbol} 
        />

        <InvoiceServiceDetails 
          callDuration={callDuration} 
          totalMinutes={totalMinutes} 
          costPerMinute={costPerMinute} 
          currencySymbol={currencySymbol} 
        />

        {technologies && technologies.length > 0 && (
          <InvoiceTechnologyStack technologies={technologies} />
        )}

        <div className="mt-6 print:break-inside-avoid print:mt-4">
          <InvoiceItemsTable 
            totalMinutes={totalMinutes} 
            totalCost={totalCost} 
            setupCost={setupCost} 
            costPerMinute={costPerMinute} 
            currencySymbol={currencySymbol} 
          />
        </div>

        <div className="print:break-inside-avoid">
          <InvoiceTotals 
            totalCost={totalCost} 
            setupCost={setupCost} 
            taxRate={taxRate} 
            taxAmount={taxAmount}
            total={total} 
            currencySymbol={currencySymbol} 
          />
        </div>

        <div className="print:break-inside-avoid">
          <InvoiceFooter agencyInfo={agencyInfo} />
        </div>
      </div>
    </div>
  );
}
