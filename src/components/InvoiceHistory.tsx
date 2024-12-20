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
import { Edit, Printer, Save, Trash2, RotateCw } from "lucide-react";
import { CurrencyType } from "@/components/calculator/CalculatorState";

interface InvoiceHistoryListProps {
  invoices: InvoiceHistory[];
  onEdit: (invoice: InvoiceHistory) => void;
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  onSave?: (invoice: InvoiceHistory) => void;
  editingId?: string;
  recalculatedId?: string;
  currency: CurrencyType;
}

export function InvoiceHistoryList({
  invoices,
  onEdit,
  onDelete,
  onPrint,
  onSave,
  editingId,
  recalculatedId,
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
                  {editingId === invoice.id ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(invoice)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(invoice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPrint(invoice)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  {recalculatedId === invoice.id && onSave && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onSave(invoice)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
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