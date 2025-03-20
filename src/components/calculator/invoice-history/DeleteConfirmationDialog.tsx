
import React from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  count?: number;
}

export function DeleteConfirmationDialog({
  isOpen,
  onCancel,
  onConfirm,
  count = 1
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation();
  
  const isMultiple = count > 1;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isMultiple ? t("invoice:confirmDeleteMultiple") : t("invoice:confirmDelete")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isMultiple 
              ? t("invoice:deleteMultipleInvoicesConfirmation") 
              : t("invoice:deleteInvoiceConfirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t("invoice:cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {t("invoice:delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
