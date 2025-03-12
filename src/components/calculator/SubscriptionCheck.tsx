
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SubscriptionCheckProps {
  isCheckingSubscription: boolean;
  isSubscribed: boolean;
  isSubscriptionActive: boolean;
  invoiceCount: number;
  editingInvoice: any;
  onProceed: () => void;
}

export function SubscriptionCheck({
  isCheckingSubscription,
  onProceed
}: SubscriptionCheckProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const handleCalculate = async () => {
    // If still checking subscription status, show loading toast
    if (isCheckingSubscription) {
      toast({
        title: t("checkingSubscription"),
        description: t("pleaseWait"),
      });
      return;
    }

    // Proceed with calculation since we've removed all restrictions
    onProceed();
  };
  
  return { handleCalculate };
}
