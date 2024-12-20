import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Subscription } from '@/types/invoice';

export function DashboardSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getSubscription();
  }, []);

  async function getSubscription() {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSubscription(data as Subscription);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error loading subscription',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Subscription</h2>
      {subscription && (
        <div className="space-y-2">
          <p>Plan: {subscription.plan_type}</p>
          <p>Status: {subscription.status}</p>
          <p>Invoices Generated: {subscription.invoice_count}</p>
          {subscription.current_period_end && (
            <p>
              Current Period Ends:{' '}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}