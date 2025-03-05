
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  FileDown, 
  Save, 
  X, 
  Eye, 
  Clock, 
  CalendarDays 
} from "lucide-react";
import { format } from "date-fns";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "./CalculatorState";

interface InvoiceHistoryTableProps {
  invoices: InvoiceHistory[];
  onExportPDF: (id: string) => void;
  onStartEdit: (invoice: InvoiceHistory) => void;
  onCancelEdit: () => void;
  editingInvoiceId: string | null;
  currency: CurrencyType;
}

export function InvoiceHistoryTable({
  invoices,
  onExportPDF,
  onStartEdit,
  onCancelEdit,
  editingInvoiceId,
  currency
}: InvoiceHistoryTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  if (!invoices || invoices.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No invoices found. Create your first invoice by calculating a cost.</p>
      </div>
    );
  }

  const getCurrencySymbol = (currency: CurrencyType) => {
    return currency === 'EUR' ? '€' : '$';
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden shadow-sm mt-8 animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <th className="py-3 px-4 text-left">Invoice #</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Client</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <tr 
                  className={`hover:bg-gray-50 ${editingInvoiceId === invoice.id ? 'bg-indigo-50' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <button 
                        onClick={() => toggleRowExpand(invoice.id)}
                        className="mr-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <Eye size={16} />
                      </button>
                      {invoice.invoice_number}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(invoice.created_at), 'dd MMM yyyy')}
                  </td>
                  <td className="py-3 px-4">
                    {invoice.client_info.name}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {getCurrencySymbol(currency)} {invoice.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onExportPDF(invoice.id)}
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      >
                        <FileDown size={16} />
                      </Button>
                      
                      {editingInvoiceId === invoice.id ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={onCancelEdit}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X size={16} />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onStartEdit(invoice)}
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRowId === invoice.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="py-4 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Client Details</h4>
                          <p className="text-sm text-gray-600">{invoice.client_info.name}</p>
                          <p className="text-sm text-gray-600">{invoice.client_info.address}</p>
                          <p className="text-sm text-gray-600">TVA: {invoice.client_info.tvaNumber}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Invoice Details</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <CalendarDays size={14} className="mr-1" /> Created: {format(new Date(invoice.created_at), 'PPP')}
                          </p>
                          {invoice.last_exported_at && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <Clock size={14} className="mr-1" /> Last exported: {format(new Date(invoice.last_exported_at), 'PPP')}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">Setup cost: {getCurrencySymbol(currency)} {invoice.setup_cost.toFixed(2)}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Summary</h4>
                          <p className="text-sm text-gray-600">Total minutes: {invoice.total_minutes}</p>
                          <p className="text-sm text-gray-600">Call duration: {invoice.call_duration} min</p>
                          <p className="text-sm text-gray-600">Margin: {invoice.margin}%</p>
                          <p className="text-sm text-gray-600">Tax rate: {invoice.tax_rate}%</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
