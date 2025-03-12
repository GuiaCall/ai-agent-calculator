
import { useTranslation } from "react-i18next";

interface SubscriptionCheckProps {
  onProceed: () => void;
  isSubscribed?: boolean;
  isSubscriptionActive?: boolean;
  isCheckingSubscription?: boolean;
  invoiceCount?: number;
  editingInvoice?: any;
}

export function SubscriptionCheck({ onProceed }: SubscriptionCheckProps) {
  const { t } = useTranslation();
  
  const handleCalculate = async () => {
    onProceed();
  };
  
  return { handleCalculate };
}
