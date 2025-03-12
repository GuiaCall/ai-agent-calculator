
import { useTranslation } from "react-i18next";

interface SubscriptionCheckProps {
  onProceed: () => void;
  isSubscribed?: boolean;
  isSubscriptionActive?: boolean;
  isCheckingSubscription?: boolean;
  invoiceCount?: number;
  editingInvoice?: any;
}

export function SubscriptionCheck({ 
  onProceed, 
  isSubscribed, 
  isSubscriptionActive, 
  isCheckingSubscription, 
  invoiceCount, 
  editingInvoice 
}: SubscriptionCheckProps) {
  const { t } = useTranslation();
  
  const handleCalculate = async () => {
    // Simplified logic that always allows proceeding
    onProceed();
  };
  
  return { handleCalculate };
}
