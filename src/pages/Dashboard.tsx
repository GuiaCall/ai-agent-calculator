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
        if (!user) return;

        setUserEmail(user.email || "");

        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subscriptionData) {
          setSubscription(subscriptionData);
        }

        const { data: invoices } = await supabase
          .from('invoices')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (invoices) {
          setTotalInvoices(invoices.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold capitalize">{subscription.plan_type}</p>
              {subscription.plan_type === 'free' && (
                <Button onClick={handleUpgrade} variant="default">
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