
import React from "react";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "../CalculatorState";
import { InvoiceActions } from "./InvoiceActions";
import { Checkbox } from "@/components/ui/checkbox";

interface InvoiceTableRowProps {
  invoice: InvoiceHistory;
  isEditing: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onEdit: (invoice: InvoiceHistory) => void;
  onCancelEdit: () => void;
  currency: CurrencyType;
  isMultiSelectMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export function InvoiceTableRow({
  invoice,
  isEditing,
  isExpanded,
  onToggleExpand,
  onDelete,
  onExport,
  onEdit,
  onCancelEdit,
  currency,
  isMultiSelectMode,
  isSelected,
  onToggleSelect
}: InvoiceTableRowProps) {
  const getCurrencySymbol = (currency: CurrencyType) => {
    return currency === 'EUR' ? '€' : '$';
  };

  return (
    <tr className={`hover:bg-gray-50 ${isEditing ? 'bg-indigo-50' : ''}`}>
      {isMultiSelectMode && (
        <td className="py-3 px-4">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            className="data-[state=checked]:bg-indigo-600"
          />
        </td>
      )}
      
      <td className="py-3 px-4">
        <div className="flex items-center">
          <button 
            onClick={() => onToggleExpand(invoice.id)}
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
        <InvoiceActions 
          invoiceId={invoice.id}
          isEditing={isEditing}
          onExport={onExport}
          onEdit={() => onEdit(invoice)}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
