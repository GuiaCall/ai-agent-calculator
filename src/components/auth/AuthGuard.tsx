
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Check for checkout success parameter
    const checkForCheckoutSuccess = () => {
      const queryParams = new URLSearchParams(location.search);
      return queryParams.get('checkout_success') === 'true';
    };

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          if (mounted) {
            // Clear any existing session data
            await supabase.auth.signOut();
            navigate("/login");
          }
          return;
        }

        if (!session && mounted) {
          navigate("/login");
          return;
        }

        // Check if the session is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User validation error:", userError);
          if (mounted) {
            await supabase.auth.signOut();
            navigate("/login");
            toast({
              title: "Session expired",
              description: "Please sign in again to continue.",
              variant: "destructive",
            });
          }
          return;
        }

        // If we have a successful checkout, check subscription status
        if (checkForCheckoutSuccess()) {
          try {
            // Wait for subscription status to update
            const checkSubscriptionStatus = async () => {
              const { data: subscription } = await supabase
                .from('subscriptions')
                .select('plan_type, status')
                .eq('user_id', user.id)
                .maybeSingle();
                
              return subscription?.plan_type === 'pro' && subscription?.status === 'active';
            };
            
            const isSubscribed = await checkSubscriptionStatus();
            
            if (!isSubscribed) {
              console.log("Subscription not active yet, waiting...");
              // We'll let the component handle this case
            }
          } catch (subError) {
            console.error("Error checking subscription:", subError);
          }
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          await supabase.auth.signOut();
          navigate("/login");
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (mounted) {
          navigate("/login");
        }
        return;
      }
      
      if (event === "SIGNED_IN" && session && mounted) {
        setIsLoading(false);
      }
    });

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
