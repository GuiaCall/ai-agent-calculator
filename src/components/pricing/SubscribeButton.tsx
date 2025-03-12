
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SubscribeButtonProps {
  loading: boolean;
  onClick: () => void;
  isReactivation?: boolean;
}

export function SubscribeButton({ 
  loading, 
  onClick, 
  isReactivation = false 
}: SubscribeButtonProps) {
  const { t } = useTranslation();
  
  return (
    <Button 
      className="w-full" 
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("processing")}
        </span>
      ) : (
        isReactivation ? t("reactivateSubscription") : t("upgradeToPro")
      )}
    </Button>
  );
}
