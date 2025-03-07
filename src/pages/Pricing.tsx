
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch subscription status
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('plan_type, status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (subError) {
          console.error("Error fetching subscription:", subError);
          return;
        }

        if (subscription) {
          setIsSubscribed(subscription.plan_type === 'pro');
          setSubscriptionStatus(subscription.status);
          console.log("Current subscription:", subscription);
        }

        // Fetch invoice count
        const { count, error } = await supabase
          .from('invoices')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);
        
        if (error) {
          console.error("Error fetching invoice count:", error);
          return;
        }

        setInvoiceCount(count || 0);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();

    // Listen for subscription changes
    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload) => {
          console.log('Subscription change detected:', payload);
          fetchUserData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      console.log("Starting subscription process");
      
      // Get current user token to pass to edge function
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error(sessionError?.message || "No active session found. Please log in again.");
      }
      
      console.log("Got session, preparing to call edge function");
      
      // Call the edge function with proper authorization
      const { data: sessionData, error: functionError } = await supabase.functions.invoke(
        'create-checkout-session', 
        {
          body: { couponCode: couponCode.trim() || undefined },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );
      
      console.log("Edge function response:", sessionData, functionError);
      
      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(functionError.message || "Failed to create checkout session");
      }
      
      if (!sessionData?.url) {
        console.error("No checkout URL returned:", sessionData);
        throw new Error('No checkout URL returned from server');
      }
      
      // Redirect to Stripe checkout
      console.log("Redirecting to Stripe checkout:", sessionData.url);
      window.location.href = sessionData.url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: t("error"),
        description: error.message || t("operationFailed"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{t("pricingTitle")}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("pricingDescription")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2 hover:border-primary transition-all">
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
                disabled={!isSubscribed || isSubscribed}
              >
                {isSubscribed ? t("upgradeToProFirst") : t("currentPlan")}
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
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
                  {/* Coupon Code Input */}
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
                  {/* Coupon Code Input */}
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
