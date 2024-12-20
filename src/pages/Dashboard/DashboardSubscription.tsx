import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/types/database";

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export function DashboardSubscription() {
  const navigate = useNavigate();
  
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .single();
        
      if (error) throw error;
      return data as Subscription;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Subscription</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Plan:</span> {subscription?.plan_type || 'Free'}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {subscription?.status || 'Active'}
        </p>
        <p>
          <span className="font-semibold">Invoices Created:</span>{' '}
          {subscription?.invoices_generated || 0}
        </p>
        {(!subscription || subscription.plan_type === 'free') && (
          <Button onClick={() => navigate('/pricing')}>
            Upgrade to Premium
          </Button>
        )}
      </div>
    </Card>
  );
}