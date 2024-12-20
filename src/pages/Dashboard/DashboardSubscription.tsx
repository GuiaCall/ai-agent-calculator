import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  plan_type: string;
  status: string;
  invoice_count: number;
  current_period_end: string | null;
}

export default function DashboardSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subscription",
        variant: "destructive",
      });
      return;
    }

    setSubscription(data);
  }

  if (!subscription) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
      <div className="space-y-2">
        <p>Plan: {subscription.plan_type}</p>
        <p>Status: {subscription.status}</p>
        <p>Invoices Generated: {subscription.invoice_count || 0}</p>
        {subscription.current_period_end && (
          <p>Renewal Date: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
        )}
      </div>
    </Card>
  );
}