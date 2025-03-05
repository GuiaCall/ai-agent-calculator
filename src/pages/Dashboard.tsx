
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

export default function Dashboard() {
  const [totalInvoices, setTotalInvoices] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [subscription, setSubscription] = useState({ plan_type: "free" });
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
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
        title: t("errorUpdatingPassword"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('Dashboard component mounted');
    fetchDashboardData();

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

    return () => {
      console.log('Cleaning up dashboard subscription');
      supabase.removeChannel(channel);
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

  return (
    <CalculatorStateProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        <h1 className="text-3xl font-bold mb-8">{t("dashboard.dashboard")}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t("dashboard.totalInvoices")}</h3>
            <p className="text-3xl font-bold">
              {totalInvoices === null ? t("dashboard.loading") : totalInvoices}
            </p>
            {subscription.plan_type === 'free' && totalInvoices !== null && (
              <p className="text-sm text-gray-500 mt-2">
                {t("dashboard.freeInvoicesUsed", { used: totalInvoices, total: 5 })}
              </p>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t("dashboard.currentPlan")}</h3>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold capitalize">{subscription.plan_type}</p>
              {subscription.plan_type === 'free' && (
                <Button onClick={() => navigate('/pricing')} variant="default">
                  {t("dashboard.upgradePlan")}
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold">{t("dashboard.accountInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t("dashboard.email")}</p>
                <p className="font-medium">{userEmail}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{t("dashboard.changePassword")}</p>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("dashboard.newPasswordPlaceholder")}
                />
                <Button onClick={handlePasswordChange}>
                  {t("dashboard.updatePassword")}
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
