import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Printer, Trash2 } from "lucide-react";
import { InvoiceHistory } from "@/types/invoice";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InvoiceTableRowProps {
  invoice: InvoiceHistory;
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  currencySymbol: string;
}

export function InvoiceTableRow({
  invoice,
  onDelete,
  onPrint,
  currencySymbol,
}: InvoiceTableRowProps) {
  return (
    <TableRow>
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {invoice.last_exported_at ? format(new Date(invoice.last_exported_at), 'dd/MM/yyyy HH:mm') : 'Never exported'}
            </TooltipTrigger>
            <TooltipContent>
              <p>Last PDF export date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
  );
}