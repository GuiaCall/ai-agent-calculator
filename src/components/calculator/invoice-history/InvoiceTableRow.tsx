
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  FileDown, 
  X, 
  Eye, 
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "../CalculatorState";
import { useTranslation } from "react-i18next";
import { getCurrencySymbol } from "@/utils/currencyUtils";

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
  currency
}: InvoiceTableRowProps) {
  const { t } = useTranslation();
  const currencySymbol = getCurrencySymbol(currency);
  
  return (
    <tr className={`hover:bg-gray-50 ${isEditing ? 'bg-indigo-50' : ''}`}>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <button 
            onClick={() => onToggleExpand(invoice.id)}
            className="mr-2 text-indigo-600 hover:text-indigo-800"
            title={isExpanded ? t("collapse") : t("expand")}
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
        {currencySymbol} {invoice.total_amount.toFixed(2)}
      </td>
      <td className="py-3 px-4">
        <div className="flex justify-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onExport(invoice.id)}
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            title={t("exportPDF")}
          >
            <FileDown size={16} />
          </Button>
          
          {isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCancelEdit}
              className="text-red-600 border-red-200 hover:bg-red-50"
              title={t("cancelEdit")}
            >
              <X size={16} />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(invoice)}
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
              title={t("edit")}
            >
              <Edit size={16} />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(invoice.id)}
            className="text-red-600 border-red-200 hover:bg-red-50"
            title={t("delete")}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
