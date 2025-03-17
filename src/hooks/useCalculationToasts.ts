
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useCalculationToasts() {
  const { t } = useTranslation();

  const showSuccessToast = (isAuthenticated: boolean, isEditing: boolean) => {
    if (isEditing) {
      toast({
        title: t("success"),
        description: t("invoiceUpdatedSuccessfully"),
      });
    } else if (isAuthenticated) {
      toast({
        title: t("success"),
        description: t("costCalculationCompletedAndSaved"),
      });
    } else {
      toast({
        title: t("success"),
        description: t("costCalculationCompleted"),
      });
    }
  };

  const showErrorToast = (message: string, isEditing: boolean = false) => {
    toast({
      title: t("error"),
      description: isEditing ? t("failedToUpdateInvoice") : message,
      variant: "destructive",
    });
  };

  const showTechnologySelectionError = () => {
    toast({
      title: t("error"),
      description: t("pleaseSelectAtLeastOneTechnology"),
      variant: "destructive",
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
    showTechnologySelectionError
  };
}
