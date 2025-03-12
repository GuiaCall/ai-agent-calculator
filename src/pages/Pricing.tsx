
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { PageLoader } from "@/components/layout/PageLoader";
import { SubscriptionData } from "@/hooks/useDashboardData";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Add debounce to prevent multiple subscription requests
  const [lastAttempt, setLastAttempt] = useState(0);

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
  }, [location, toast, t]);

  const fetchUserData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshingStatus(true);
      }
      
      // Always get a fresh session to ensure token is valid
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.log("No active session found, redirecting to login");
        navigate('/login');
        return;
      }

      const user = sessionData.session.user;
      console.log("Current user:", user.id);

      try {
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('plan_type, status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (subError) {
          console.error("Error fetching subscription:", subError);
          toast({
            title: t("error"),
            description: "Failed to fetch subscription status",
            variant: "destructive",
          });
          return;
        }

        if (subscription) {
          setIsSubscribed(subscription.plan_type === 'pro');
          setSubscriptionStatus(subscription.status);
          console.log("Current subscription:", subscription);
          
          if (forceRefresh && subscription.plan_type === 'pro' && subscription.status === 'active') {
            toast({
              title: t("subscriptionVerified"),
              description: t("proFeaturesActive"),
            });
            
            // Force reload the page to ensure all components reflect the new subscription status
            window.location.reload();
          }
        } else {
          console.log("No subscription found for user");
        }
      } catch (err) {
        console.error("Subscription fetch error:", err);
      }

      try {
        const { count, error } = await supabase
          .from('invoices')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_deleted', false);
        
        if (error) {
          console.error("Error fetching invoice count:", error);
          return;
        }

        setInvoiceCount(count || 0);
        console.log("Invoice count:", count);
      } catch (err) {
        console.error("Invoice count fetch error:", err);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setPageLoading(false);
      if (forceRefresh) {
        setRefreshingStatus(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();

    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload: any) => {
          console.log('Subscription change detected:', payload);
          fetchUserData(true);
          
          // If subscription becomes active, reload the page
          const newData = payload.new as SubscriptionData | null;
          if (newData && newData.plan_type === 'pro' && newData.status === 'active') {
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubscribe = async () => {
    // Prevent multiple rapid clicks
    const now = Date.now();
    if (now - lastAttempt < 3000) {
      console.log("Preventing duplicate request");
      return;
    }
    setLastAttempt(now);
    
    try {
      setLoading(true);
      console.log("Starting subscription process");
      
      // Get a fresh session with a fresh token
      const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !sessionData?.session) {
        console.error("Session refresh error:", refreshError);
        throw new Error(refreshError?.message || "Failed to get session. Please log in again.");
      }
      
      const session = sessionData.session;
      const token = session.access_token;
      
      console.log("Got fresh session, preparing to call edge function");
      console.log("Access token exists:", !!token);
      
      if (!token) {
        throw new Error("No access token available. Please log in again.");
      }
      
      // Add additional logging
      console.log("Making call to create-checkout-session function...");
      
      // Make sure we explicitly set the Authorization header
      const { data: checkoutData, error: functionError } = await supabase.functions.invoke(
        'create-checkout-session', 
        {
          body: { couponCode: couponCode.trim() || undefined },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Edge function response:", checkoutData, functionError);
      
      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(functionError.message || "Failed to create checkout session");
      }
      
      if (!checkoutData?.url) {
        console.error("No checkout URL returned:", checkoutData);
        throw new Error('No checkout URL returned from server');
      }
      
      console.log("Redirecting to Stripe checkout:", checkoutData.url);
      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: t("error"),
        description: error.message || t("operationFailed"),
        variant: "destructive",
      });
      // Reset loading state so user can try again
      setLoading(false);
    }
  };

  const handleRefreshStatus = () => {
    fetchUserData(true);
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-6">{t("pricingTitle")}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("pricingDescription")}</p>
            
            {isSubscribed && (
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
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card className={`p-8 border-2 hover:border-primary transition-all ${!isSubscribed ? 'border-primary' : ''}`}>
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-3">{t("freePlan")}</h3>
                <p className="text-gray-600 mb-6">{t("freePlanDescription")}</p>
                <div className="text-3xl font-bold">
                  €0/<span className="text-xl text-gray-500">{t("month")}</span>
                </div>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("generateUpToFiveInvoices", { count: invoiceCount })}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("basicInvoiceGeneration")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("pdfExportFunctionality")}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                disabled={true}
              >
                {isSubscribed ? t("upgradeToProFirst") : t("currentPlan")}
              </Button>
            </Card>

            <Card className={`p-8 border-2 ${isSubscribed && subscriptionStatus === 'active' ? 'border-primary bg-primary/5' : ''} hover:bg-primary/10 transition-all`}>
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-3">{t("proPlan")}</h3>
                <p className="text-gray-600 mb-6">{t("proPlanDescription")}</p>
                <div className="text-3xl font-bold">
                  €7.99/<span className="text-xl text-gray-500">{t("month")}</span>
                </div>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("generateUnlimitedInvoices")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("accessToAllFeatures")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("futureFeatureUpgrades")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("pdfExportFunctionality")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{t("accessToAllSavedInvoices")}</span>
                </div>
              </div>
              
              {isSubscribed && subscriptionStatus === 'active' ? (
                <Button className="w-full" variant="outline" disabled>
                  {t("currentPlan")}
                </Button>
              ) : isSubscribed && subscriptionStatus !== 'active' ? (
                <>
                  <div className="mb-4">
                    <Label htmlFor="couponCode" className="mb-2 block">
                      {t("couponCode")}
                    </Label>
                    <Input
                      id="couponCode"
                      placeholder={t("enterCouponCode")}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="mb-4"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSubscribe}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("processing")}
                      </span>
                    ) : (
                      t("reactivateSubscription")
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <Label htmlFor="couponCode" className="mb-2 block">
                      {t("couponCode")}
                    </Label>
                    <Input
                      id="couponCode"
                      placeholder={t("enterCouponCode")}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="mb-4"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSubscribe}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("processing")}
                      </span>
                    ) : (
                      t("upgradeToPro")
                    )}
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
