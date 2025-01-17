import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceHistory } from "@/types/invoice";
import { InvoiceTableRow } from "./InvoiceTableRow";

interface InvoiceTableProps {
  invoices: InvoiceHistory[];
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  currencySymbol: string;
}

export function InvoiceTable({
  invoices,
  onDelete,
  onPrint,
  currencySymbol,
}: InvoiceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Last Export</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No invoices found
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <InvoiceTableRow
              key={invoice.id}
              invoice={invoice}
              onDelete={onDelete}
              onPrint={onPrint}
              currencySymbol={currencySymbol}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}