
import { Card } from "@/components/ui/card";
import type { InvoiceHistory as InvoiceHistoryType } from "@/types/invoice";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import { useInvoiceHistory } from "@/hooks/useInvoiceHistory";
import { InvoiceHistoryList } from "./invoice/InvoiceHistoryList";
import { LoadingState } from "./invoice/LoadingState";

interface InvoiceHistoryProps {
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistoryType) => void;
  currency: CurrencyType;
}

export function InvoiceHistory({
  onDelete,
  onPrint,
  currency,
}: InvoiceHistoryProps) {
  const { invoices, loading, error } = useInvoiceHistory();
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">Error: {error}</div>
      </Card>
    );
  }
  
  return (
    <InvoiceHistoryList 
      invoices={invoices} 
      onDelete={onDelete} 
      onPrint={onPrint} 
      currency={currency} 
    />
  );
}
