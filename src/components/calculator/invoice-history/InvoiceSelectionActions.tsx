
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceSelectionActionsProps {
  isMultiSelectMode: boolean;
  selectedCount: number;
  onToggleMultiSelectMode: () => void;
  onBulkDelete: () => void;
}

export function InvoiceSelectionActions({
  isMultiSelectMode,
  selectedCount,
  onToggleMultiSelectMode,
  onBulkDelete
}: InvoiceSelectionActionsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-2">
      {isMultiSelectMode && selectedCount > 0 && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onBulkDelete}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          {t("invoice:deleteSelected")} ({selectedCount})
        </Button>
      )}
      
      <Button 
        variant={isMultiSelectMode ? "outline" : "secondary"} 
        size="sm" 
        onClick={onToggleMultiSelectMode}
        className="flex items-center gap-1"
      >
        {isMultiSelectMode ? (
          <>
            <X size={16} />
            {t("invoice:cancelSelection")}
          </>
        ) : (
          <>
            <CheckSquare size={16} />
            {t("invoice:selectMultiple")}
          </>
        )}
      </Button>
    </div>
  );
}
