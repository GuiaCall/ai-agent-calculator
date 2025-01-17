import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoicePreviewProps {
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
  totalMinutes: number;
  totalCost: number | null;
  setupCost: number | null;
  taxRate: number;
  themeColor: string;
  currency: CurrencyType;
}

export function InvoicePreview({
  agencyInfo,
  clientInfo,
  totalMinutes,
  totalCost,
  setupCost,
  taxRate,
  currency,
}: InvoicePreviewProps) {
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
  const costPerMinute = totalCost && totalMinutes ? totalCost / totalMinutes : 0;
  const taxAmount = (totalCost || 0) * (taxRate / 100);
  const total = (totalCost || 0) * (1 + taxRate / 100) + (setupCost || 0);
  
  return (
    <div className="max-w-[210mm] mx-auto p-6 bg-background text-foreground border rounded-lg shadow-lg dark:bg-slate-900">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Invoice Preview</h2>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Agency Information</h3>
          <p className="text-sm">{agencyInfo.name}</p>
          <p className="text-sm">{agencyInfo.phone}</p>
          <p className="text-sm">{agencyInfo.address}</p>
          <p className="text-sm">{agencyInfo.email}</p>
          <p className="text-sm">{agencyInfo.website}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Client Information</h3>
          <p className="text-sm">{clientInfo.name}</p>
          <p className="text-sm">{clientInfo.address}</p>
          <p className="text-sm">TVA Number: {clientInfo.tvaNumber}</p>
          <p className="text-sm">Contact Person: {clientInfo.contactPerson.name} ({clientInfo.contactPerson.phone})</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Invoice Details</h3>
        <div className="rounded-lg border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Description</TableHead>
                <TableHead className="w-1/6">Quantity</TableHead>
                <TableHead className="w-1/4">Rate</TableHead>
                <TableHead className="text-right w-1/4">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {setupCost && setupCost > 0 && (
                <TableRow>
                  <TableCell>Setup Cost</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{currencySymbol}{setupCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{currencySymbol}{setupCost.toFixed(2)}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Monthly Service</TableCell>
                <TableCell>{totalMinutes} minutes</TableCell>
                <TableCell>{currencySymbol}{costPerMinute.toFixed(4)}/min</TableCell>
                <TableCell className="text-right">{currencySymbol}{(totalCost || 0).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                <TableCell className="text-right">{currencySymbol}{((totalCost || 0) + (setupCost || 0)).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Tax ({taxRate}%)</TableCell>
                <TableCell className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">{currencySymbol}{total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}