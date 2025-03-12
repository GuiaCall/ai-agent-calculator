
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useCheckoutSuccess(fetchUserData: (forceRefresh?: boolean) => Promise<void>) {
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const checkoutSuccess = queryParams.get('checkout_success');
    
    if (checkoutSuccess === 'true') {
      toast({
        title: t("checkoutSuccess"),
        description: t("subscriptionProcessing"),
        duration: 8000,
      });
      
      const newUrl = location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      let checkCount = 0;
      const maxChecks = 15; 
      
      const checkInterval = setInterval(() => {
        checkCount++;
        console.log(`Checking subscription status update (${checkCount}/${maxChecks})`);
        fetchUserData(true);
        
        if (checkCount >= maxChecks) {
          clearInterval(checkInterval);
        }
      }, 5000);
      
      return () => clearInterval(checkInterval);
    }
  }, [location, toast, t, fetchUserData]);
}
