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
          {invoices?.map((invoice) => (
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
                    onClick={() => onDelete(invoice.id)}
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