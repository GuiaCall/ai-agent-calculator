import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (plan: 'free' | 'premium') => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (plan === 'premium') {
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId: 'price_1QXj5IJxQ3vRyrS2nku3L71t'
          }
        });

        if (error) throw error;
        if (data?.url) window.location.href = data.url;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } else {
      navigate("/calculator");
    }
  };

  return (
    <CalculatorStateProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 mx-auto py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 space-y-6 hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Free Plan</h3>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>
              <div className="text-3xl font-bold">€0/month</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Up to 5 invoices per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Basic calculator features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>PDF export</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handleSubscribe('free')}
              >
                Get Started
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 space-y-6 hover:shadow-lg transition-shadow border-primary">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Premium Plan</h3>
                <p className="text-muted-foreground">For growing businesses</p>
              </div>
              <div className="text-3xl font-bold">€7.99/month</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Advanced calculator features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Custom branding</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                variant="default"
                onClick={() => handleSubscribe('premium')}
              >
                Subscribe Now
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </CalculatorStateProvider>
  );
}