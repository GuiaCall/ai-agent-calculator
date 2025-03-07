
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type SubscriptionData = Tables<"subscriptions"> | null;

export default function Dashboard() {
  const [totalInvoices, setTotalInvoices] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan_type: "free",
    status: "active",
    id: "",
    user_id: "",
    created_at: "",
    updated_at: "",
    current_period_end: null,
    invoice_count: 0,
    stripe_customer_id: null,
    stripe_subscription_id: null
  });
  const [newPassword, setNewPassword] = useState("");
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const checkoutSuccess = searchParams.get('checkout_success') === 'true';

  const fetchDashboardData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshingStatus(true);
      }

      // Always get a fresh session to ensure token validity
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError || !sessionData?.session?.user) {
        console.log('No user found or session error:', sessionError);
        navigate('/login');
        return;
      }

      const user = sessionData.session.user;
      console.log('Fetching dashboard data for user:', user.id);
      setUserEmail(user.email || "");

      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscriptionError) {
        console.error('Subscription error:', subscriptionError);
        throw subscriptionError;
      }

      if (subscriptionData) {
        console.log('Subscription data:', subscriptionData);
        setSubscription(subscriptionData);
        
        // If the user has just completed checkout and has an active subscription, show success message
        if (forceRefresh && subscriptionData.plan_type === 'pro' && subscriptionData.status === 'active') {
          toast({
            title: t("subscriptionVerified"),
            description: t("proFeaturesActive"),
          });
        }
      }

      // Fetch non-deleted invoices count
      const { count, error: countError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      if (countError) {
        console.error('Count error:', countError);
        throw countError;
      }

      console.log('Invoice count:', count);
      setTotalInvoices(count || 0);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: t("errorFetchingData"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      if (forceRefresh) {
        setRefreshingStatus(false);
      }
    }
  };

  useEffect(() => {
    console.log('Dashboard component mounted');
    fetchDashboardData();

    // Show checkout success toast if redirected from successful checkout
    if (checkoutSuccess) {
      toast({
        title: t("checkoutSuccessful"),
        description: t("subscriptionProcessing"),
        duration: 8000,
      });
      
      // Remove the query parameter from the URL but don't trigger a reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Aggressively check for subscription updates for the next minute
      let checkCount = 0;
      const maxChecks = 15; // Increased checks
      
      const checkInterval = setInterval(() => {
        checkCount++;
        console.log(`Checking subscription status update ${checkCount}/${maxChecks}`);
        fetchDashboardData(true);
        
        // If we detect a pro subscription, trigger a page reload to refresh all components
        if (subscription.plan_type === 'pro' && subscription.status === 'active') {
          console.log("Pro subscription detected, reloading page");
          clearInterval(checkInterval);
          window.location.reload();
        }
        
        if (checkCount >= maxChecks) {
          clearInterval(checkInterval);
          console.log("Finished polling for subscription status updates");
        }
      }, 5000);
      
      return () => clearInterval(checkInterval);
    }

    const channel = supabase
      .channel('dashboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Invoice change detected in dashboard:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    // Also listen for subscription changes
    const subscriptionChannel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload) => {
          console.log('Subscription change detected in dashboard:', payload);
          fetchDashboardData(true);
          
          // Force page reload when subscription changes to ensure UI reflects new status
          if (payload.new && payload.new.plan_type === 'pro' && payload.new.status === 'active') {
            console.log("Pro subscription update detected, reloading page");
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard subscription');
      supabase.removeChannel(channel);
      supabase.removeChannel(subscriptionChannel);
    };
  }, []);

  const handlePasswordChange = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: t("passwordUpdated"),
        description: t("passwordUpdateSuccess"),
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: t("errorUpdatingPassword"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRefreshStatus = () => {
    fetchDashboardData(true);
  };

  // Get safe values with fallbacks for subscription properties
  const planType = subscription?.plan_type || 'free';
  const subscriptionStatus = subscription?.status || 'inactive';
  const isSubscriptionActive = subscriptionStatus === 'active';

  return (
    <CalculatorStateProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        <h1 className="text-3xl font-bold mb-8">{t("dashboard")}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t("totalInvoices")}</h3>
            <p className="text-3xl font-bold">
              {totalInvoices === null ? t("loading") : totalInvoices}
            </p>
            {planType === 'free' && totalInvoices !== null && (
              <p className="text-sm text-gray-500 mt-2">
                {t("freeInvoicesUsed", { used: totalInvoices, total: 5 })}
              </p>
            )}
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{t("currentPlan")}</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshStatus}
                disabled={refreshingStatus}
                className="flex items-center gap-2"
              >
                {refreshingStatus ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{t("refreshing")}</span>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{t("refresh")}</span>
                    <RefreshCw className="h-3 w-3" />
                  </div>
                )}
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold capitalize">{planType}</p>
                {planType === 'pro' && isSubscriptionActive && (
                  <div className="flex items-center text-green-500 mt-1">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">{t("subscriptionActive")}</span>
                  </div>
                )}
                {planType === 'pro' && !isSubscriptionActive && (
                  <div className="flex items-center text-amber-500 mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{t("subscriptionInactive")}</span>
                  </div>
                )}
              </div>
              {(planType === 'free' || !isSubscriptionActive) && (
                <Button onClick={() => navigate('/pricing')} variant="default">
                  {t("upgradePlan")}
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold">{t("accountInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t("email")}</p>
                <p className="font-medium">{userEmail}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{t("changePassword")}</p>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("newPasswordPlaceholder")}
                />
                <Button onClick={handlePasswordChange}>
                  {t("updatePassword")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </CalculatorStateProvider>
  );
}
