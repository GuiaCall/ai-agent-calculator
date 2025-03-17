
import { Card } from "@/components/ui/card";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import { InvoiceTable } from "./InvoiceTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrencySymbol } from "@/utils/currencyUtils";

interface InvoiceHistoryListProps {
  invoices: InvoiceHistory[];
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  currency: CurrencyType;
}

export function InvoiceHistoryList({
  invoices,
  onDelete,
  onPrint,
  currency,
}: InvoiceHistoryListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', id);

      if (deleteError) throw deleteError;

      onDelete(id);
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting invoice:', err);
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };
  
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">Invoice History</h3>
      <InvoiceTable
        invoices={invoices}
        onDelete={handleDelete}
        onPrint={onPrint}
        currencySymbol={currencySymbol}
      />
    </Card>
  );
}
