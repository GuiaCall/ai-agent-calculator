
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface SubscriptionCheckProps {
  onProceed: () => void;
}

export function SubscriptionCheck({
  onProceed
}: SubscriptionCheckProps) {
  const handleCalculate = async () => {
    // Proceed with calculation directly
    onProceed();
  };
  
  return { handleCalculate };
}
