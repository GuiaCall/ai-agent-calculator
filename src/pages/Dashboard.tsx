
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
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Dashboard() {
  const [totalInvoices, setTotalInvoices] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [subscription, setSubscription] = useState({ plan_type: "free", status: "active" });
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingSubscription, setIsTestingSubscription] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const checkoutSuccess = searchParams.get('checkout_success') === 'true';

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        setIsLoading(false);
        return;
      }

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
      setIsLoading(false);
    }
  };

  const testActivateProSubscription = async () => {
    try {
      setIsTestingSubscription(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t("testSubscriptionError"),
          description: t("notLoggedIn"),
          variant: "destructive",
        });
        return;
      }
      
      console.log('Testing pro subscription activation for user:', user.id);
      
      // Update subscription to pro
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: 'pro',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      toast({
        title: t("testSubscriptionSuccess"),
        description: t("proSubscriptionActivated"),
      });
      
      // Refresh data
      await fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error activating test subscription:', error);
      toast({
        title: t("testSubscriptionError"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingSubscription(false);
    }
  };

  const resetToFreeSubscription = async () => {
    try {
      setIsTestingSubscription(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }
      
      console.log('Resetting to free subscription for user:', user.id);
      
      // Update subscription to free
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: 'free',
          status: 'active'
        }, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      toast({
        title: t("resetSubscriptionSuccess"),
        description: t("freeSubscriptionRestored"),
      });
      
      // Refresh data
      await fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error resetting subscription:', error);
      toast({
        title: t("resetSubscriptionError"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingSubscription(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      await fetchDashboardData();
      toast({
        title: t("dataRefreshed"),
        description: t("subscriptionStatusUpdated"),
      });
    } catch (error: any) {
      toast({
        title: t("refreshError"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Dashboard component mounted');
    fetchDashboardData();

    // Show checkout success toast if redirected from successful checkout
    if (checkoutSuccess) {
      toast({
        title: t("checkoutSuccessful"),
        description: t("subscriptionActivated"),
      });
      
      // Remove the query parameter from the URL
      navigate('/dashboard', { replace: true });
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
          console.log('Subscription change detected:', payload);
          fetchDashboardData();
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

  if (isLoading) {
    return (
      <CalculatorStateProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 mb-16 flex justify-center items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{t("loadingYourDashboard")}</p>
          </div>
        </div>
        <Footer />
      </CalculatorStateProvider>
    );
  }

  return (
    <CalculatorStateProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <Button 
            variant="outline" 
            onClick={refreshSubscriptionStatus}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t("refreshStatus")}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t("totalInvoices")}</h3>
            <p className="text-3xl font-bold">
              {totalInvoices === null ? t("loading") : totalInvoices}
            </p>
            {subscription.plan_type === 'free' && totalInvoices !== null && (
              <p className="text-sm text-gray-500 mt-2">
                {t("freeInvoicesUsed", { used: totalInvoices, total: 5 })}
              </p>
            )}
            {subscription.plan_type === 'pro' && (
              <p className="text-sm text-green-500 mt-2">
                {t("unlimitedInvoices")}
              </p>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t("currentPlan")}</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold capitalize">{subscription.plan_type}</p>
                {subscription.plan_type === 'pro' && subscription.status === 'active' && (
                  <div className="flex items-center text-green-500 mt-1">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">{t("subscriptionActive")}</span>
                  </div>
                )}
                {subscription.plan_type === 'pro' && subscription.status !== 'active' && (
                  <div className="flex items-center text-amber-500 mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{t("subscriptionInactive")}</span>
                  </div>
                )}
              </div>
              {(subscription.plan_type === 'free' || subscription.status !== 'active') && (
                <Button onClick={() => navigate('/pricing')} variant="default">
                  {t("upgradePlan")}
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
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

        {/* Test Mode for Subscriptions */}
        <div className="mt-8 border border-dashed border-gray-300 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">{t("testMode")}</h2>
          <p className="text-sm text-gray-600 mb-4">{t("testModeDescription")}</p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              onClick={testActivateProSubscription}
              disabled={isTestingSubscription}
              className="bg-green-50 border-green-200 hover:bg-green-100"
            >
              {isTestingSubscription ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {t("activateProPlan")}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetToFreeSubscription}
              disabled={isTestingSubscription}
              className="bg-blue-50 border-blue-200 hover:bg-blue-100"
            >
              {isTestingSubscription ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {t("resetToFreePlan")}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </CalculatorStateProvider>
  );
}
