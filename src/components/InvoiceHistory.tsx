import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceHistory } from "@/types/invoice";
import { format } from "date-fns";
import { Printer, Trash2 } from "lucide-react";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface InvoiceHistoryListProps {
  invoices: InvoiceHistory[];
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  currency: CurrencyType;
}

export function InvoiceHistoryList({
  invoices: propInvoices,
  onDelete,
  onPrint,
  currency,
}: InvoiceHistoryListProps) {
  const { toast } = useToast();
  const [localInvoices, setLocalInvoices] = useState<InvoiceHistory[]>(propInvoices);
  
  useEffect(() => {
    const fetchInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        return;
      }

      if (data) {
        // Transform the data to match InvoiceHistory type
        const transformedData: InvoiceHistory[] = data.map(invoice => ({
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          created_at: invoice.created_at || '',
          client_info: typeof invoice.client_info === 'string' 
            ? JSON.parse(invoice.client_info)
            : invoice.client_info,
          agency_info: typeof invoice.agency_info === 'string'
            ? JSON.parse(invoice.agency_info)
            : invoice.agency_info,
          total_amount: Number(invoice.total_amount),
          tax_rate: Number(invoice.tax_rate),
          margin: Number(invoice.margin),
          setup_cost: Number(invoice.setup_cost),
          monthly_service_cost: Number(invoice.monthly_service_cost),
          total_minutes: invoice.total_minutes,
          call_duration: invoice.call_duration,
          user_id: invoice.user_id,
          is_deleted: invoice.is_deleted || false
        }));
        
        setLocalInvoices(transformedData);
      }
    };

    fetchInvoices();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('invoice_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      setLocalInvoices(prev => prev.filter(inv => inv.id !== id));
      onDelete(id);
      
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted from view.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
  
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">Invoice History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoice_number}</TableCell>
              <TableCell>
                {invoice.created_at ? format(new Date(invoice.created_at), 'dd/MM/yyyy') : 'N/A'}
              </TableCell>
              <TableCell>
                {invoice.client_info?.name || 'Unknown Client'}
              </TableCell>
              <TableCell>
                {currencySymbol}{invoice.total_amount?.toFixed(2) || '0.00'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPrint(invoice)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}