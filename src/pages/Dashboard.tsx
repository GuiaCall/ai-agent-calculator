import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [subscription, setSubscription] = useState({ plan_type: "free" });
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No user found');
          return;
        }

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
          .select('*', { count: 'exact' })
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
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();

    // Subscribe to invoice changes
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
          console.log('Invoice change detected:', payload);
          fetchDashboardData(); // Refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handlePasswordChange = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <CalculatorStateProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Invoices</h3>
            <p className="text-3xl font-bold">{totalInvoices}</p>
            {subscription.plan_type === 'free' && (
              <p className="text-sm text-gray-500 mt-2">
                {totalInvoices}/5 free invoices used
              </p>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold capitalize">{subscription.plan_type}</p>
              {subscription.plan_type === 'free' && (
                <Button onClick={() => navigate('/pricing')} variant="default">
                  Upgrade Plan
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userEmail}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Change Password</p>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                />
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </CalculatorStateProvider>
  );
}