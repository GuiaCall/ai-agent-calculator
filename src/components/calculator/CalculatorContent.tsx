
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCalculatorLogic } from "./CalculatorLogic";
import { useCalculatorStateContext } from "./CalculatorStateContext";
import { CalculatorHeader } from "./CalculatorHeader";
import { CalculatorActions } from "./CalculatorActions";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { Disclaimer } from "../Disclaimer";
import { CalculatorSettingsSection } from "./sections/CalculatorSettingsSection";
import { TechnologySection } from "./sections/TechnologySection";
import { PreviewSection } from "./sections/PreviewSection";
import { CurrencyToggle } from "./CurrencyToggle";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CalculatorContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const state = useCalculatorStateContext();
  const logic = useCalculatorLogic({ ...state });
  const navigate = useNavigate();
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscriptionAndInvoices = async () => {
      setIsCheckingSubscription(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user) {
          console.error("Session error:", sessionError);
          setIsCheckingSubscription(false);
          return;
        }
        
        const user = sessionData.session.user;
        console.log("Checking subscription for user:", user.id);

        // Get subscription details
        try {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('plan_type, status')
            .eq('user_id', user.id)
            .maybeSingle();

          if (subError) {
            console.error("Subscription fetch error:", subError);
          }

          console.log("Subscription check result:", subscription);
          
          const isPro = subscription?.plan_type === 'pro';
          const isActive = subscription?.status === 'active';
          
          setIsSubscribed(isPro);
          setIsSubscriptionActive(isActive);
          
          if (isPro && isActive) {
            console.log("User has active pro subscription");
          } else if (isPro && !isActive) {
            console.log("User has pro subscription but it's not active");
          } else {
            console.log("User has free subscription");
          }
        } catch (subErr) {
          console.error("Error processing subscription data:", subErr);
        }

        // Get invoice count
        try {
          const { count, error: countError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('is_deleted', false);

          if (countError) {
            console.error("Invoice count error:", countError);
          }

          setInvoiceCount(count || 0);
          console.log("Invoice count:", count);
        } catch (invErr) {
          console.error("Error processing invoice count:", invErr);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    checkSubscriptionAndInvoices();

    // Subscribe to subscription changes
    const subscriptionChannel = supabase
      .channel('user_subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload) => {
          console.log('Subscription change detected in calculator:', payload);
          checkSubscriptionAndInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionChannel);
    };
  }, []);

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
    if (!isSubscribed && invoiceCount >= 5 && !state.editingInvoice) {
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

    logic.calculateCost();
  };

  if (state.isLoading || isCheckingSubscription) {
    return (
      <>
        <Navbar />
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">{t("loadingCalculatorData")}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn mt-20 mb-20">
        <Disclaimer />
        
        <CalculatorHeader
          agencyInfo={state.agencyInfo}
          clientInfo={state.clientInfo}
          onAgencyInfoChange={state.setAgencyInfo}
          onClientInfoChange={state.setClientInfo}
        />

        <CurrencyToggle />
        
        <CalculatorSettingsSection />
        
        <TechnologySection />

        <CalculatorActions
          onCalculate={handleCalculate}
          onPreviewToggle={() => state.setShowPreview(!state.showPreview)}
          onExportPDF={logic.exportPDF}
          onCancelEdit={logic.cancelEdit}
          totalCost={state.totalCost}
          setupCost={state.setupCost}
          currency={state.currency}
          totalMinutes={state.totalMinutes}
          isEditingInvoice={!!state.editingInvoice}
        />

        <PreviewSection />
      </div>
      <Footer />
    </>
  );
}
