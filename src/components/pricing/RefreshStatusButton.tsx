
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RefreshStatusButtonProps {
  refreshingStatus: boolean;
  handleRefreshStatus: () => void;
}

export function RefreshStatusButton({ 
  refreshingStatus, 
  handleRefreshStatus 
}: RefreshStatusButtonProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mt-4 flex justify-center">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleRefreshStatus}
        disabled={refreshingStatus}
        className="flex items-center gap-2"
      >
        {refreshingStatus ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {t("refreshSubscriptionStatus")}
      </Button>
    </div>
  );
}
