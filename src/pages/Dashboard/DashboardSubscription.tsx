import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Subscription } from '@/types/invoice';

export function DashboardSubscription() {
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
        description: "Failed to fetch subscription details",
        variant: "destructive",
      });
      return;
    }

    setSubscription(data as Subscription);
  }

  if (!subscription) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Details</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Plan Type</p>
          <p className="text-lg">{subscription.plan_type}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Status</p>
          <p className="text-lg">{subscription.status}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Invoices Generated</p>
          <p className="text-lg">{subscription.invoice_count}</p>
        </div>
      </div>
    </Card>
  );
}