
import { useTranslation } from "react-i18next";

interface SubscriptionCheckProps {
  onProceed: () => void;
}

export function SubscriptionCheck({ onProceed }: SubscriptionCheckProps) {
  const { t } = useTranslation();
  
  // Simple check that always allows proceeding
  const handleCalculate = async () => {
    onProceed();
  };
  
  return { handleCalculate };
}
