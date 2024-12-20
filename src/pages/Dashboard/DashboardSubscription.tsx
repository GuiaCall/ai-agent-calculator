import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

export default function DashboardSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getSubscription();
  }, []);

  async function getSubscription() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setSubscription(data as Subscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Error",
        description: "Could not load subscription information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleUpgrade = () => {
    // Navigate to pricing page or trigger upgrade flow
    window.location.href = '/pricing';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription</h2>
      {subscription && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Current Plan</p>
            <p className="text-lg font-semibold capitalize">{subscription.plan_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-lg font-semibold capitalize">{subscription.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Invoices Generated</p>
            <p className="text-lg font-semibold">{subscription.invoice_count}</p>
          </div>
          {subscription.plan_type === 'free' && (
            <Button onClick={handleUpgrade} className="w-full">
              Upgrade to Premium
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}