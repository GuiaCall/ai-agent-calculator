
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, FileDown, X, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceActionsProps {
  invoiceId: string;
  isEditing: boolean;
  onExport: (id: string) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

export function InvoiceActions({
  invoiceId,
  isEditing,
  onExport,
  onEdit,
  onCancelEdit,
  onDelete
}: InvoiceActionsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onExport(invoiceId)}
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
          onClick={onEdit}
          className="text-amber-600 border-amber-200 hover:bg-amber-50"
          title={t("edit")}
        >
          <Edit size={16} />
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onDelete(invoiceId)}
        className="text-red-600 border-red-200 hover:bg-red-50"
        title={t("delete")}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
