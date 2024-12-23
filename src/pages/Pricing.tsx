import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoiceCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      setInvoiceCount(count || 0);
    };

    fetchInvoiceCount();
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 border-2 hover:border-primary transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <p className="text-gray-600 mb-4">Perfect for getting started</p>
              <div className="text-3xl font-bold">€0/month</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Generate up to 5 invoices ({invoiceCount}/5 used)</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic invoice generation</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>PDF export functionality</span>
              </div>
            </div>

            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <p className="text-gray-600 mb-4">For growing businesses</p>
              <div className="text-3xl font-bold">€7.99/month</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Generate unlimited invoices</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to all features 24/7</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Future feature upgrades included</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>PDF export functionality</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to all saved invoices</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upgrade to Pro"}
            </Button>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}