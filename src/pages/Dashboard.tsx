import { DashboardProfile } from "./Dashboard/DashboardProfile";
import { DashboardSubscription } from "./Dashboard/DashboardSubscription";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-6 space-y-8 mt-16">
        <div className="grid md:grid-cols-2 gap-6">
          <DashboardProfile />
          <DashboardSubscription />
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Revenue Overview</h2>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No revenue data available yet</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-muted-foreground">
            No recent activity to display
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}