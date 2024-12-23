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
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  
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
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{format(new Date(invoice.date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{invoice.clientInfo.name}</TableCell>
              <TableCell>{currencySymbol}{invoice.totalAmount.toFixed(2)}</TableCell>
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