
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
  isSubscribed,
  isSubscriptionActive,
  invoiceCount,
  editingInvoice,
  onProceed
}: SubscriptionCheckProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCalculate = async () => {
    // If still checking subscription status, show loading toast
    if (isCheckingSubscription) {
      toast({
        title: t("checkingSubscription"),
        description: t("pleaseWait"),
      });
      return;
    }
    
    // Check if user is on free plan, has reached limit, and is not editing an existing invoice
    if (!isSubscribed && invoiceCount >= 5 && !editingInvoice) {
      toast({
        title: t("freePlanLimit"),
        description: t("pleaseUpgrade"),
        variant: "destructive",
        action: (
          <button
            onClick={() => navigate('/pricing')}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium"
          >
            {t("upgradeNow")}
          </button>
        ),
      });
      return;
    }

    // Check if subscription is inactive
    if (isSubscribed && !isSubscriptionActive) {
      toast({
        title: t("subscriptionInactive"),
        description: t("subscriptionReactivate"),
        variant: "warning",
        action: (
          <button
            onClick={() => navigate('/pricing')}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium"
          >
            {t("reactivateNow")}
          </button>
        ),
      });
      return;
    }

    // Proceed with calculation if all subscription checks pass
    onProceed();
  };
  
  return { handleCalculate };
}
