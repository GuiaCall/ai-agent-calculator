import { Card } from "@/components/ui/card";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import { useInvoices } from "@/hooks/useInvoices";
import { InvoiceTable } from "./InvoiceTable";

interface InvoiceHistoryListProps {
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  currency: CurrencyType;
}

export function InvoiceHistoryList({
  onDelete,
  onPrint,
  currency,
}: InvoiceHistoryListProps) {
  const { invoices, isLoading, handleDelete } = useInvoices();

  const getCurrencySymbol = (currency: CurrencyType) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '$';
    }
  };
  
  const currencySymbol = getCurrencySymbol(currency);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading invoices...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">Invoice History</h3>
      <InvoiceTable
        invoices={invoices}
        onDelete={(id) => {
          handleDelete(id);
          onDelete(id);
        }}
        onPrint={onPrint}
        currencySymbol={currencySymbol}
      />
    </Card>
  );
}