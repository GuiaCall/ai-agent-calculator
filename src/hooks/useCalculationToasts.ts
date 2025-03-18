
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

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
      title: t("warning"),
      description: t("pleaseSelectTechnologyStack"),
      variant: "destructive",
      icon: <AlertCircle className="h-5 w-5" />,
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
    showTechnologySelectionError
  };
}
