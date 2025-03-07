
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

        // If we have a successful checkout, handle subscription checking
        if (checkForCheckoutSuccess()) {
          try {
            console.log("Detected checkout success, checking subscription status");
            
            // Poll for subscription status updates with increased attempts and timeout
            let attempts = 0;
            const maxAttempts = 20; // Increased from 15
            const checkSubscriptionStatus = async (): Promise<boolean> => {
              try {
                // Force refresh the subscription data to ensure we have the latest
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                if (refreshError) {
                  console.error("Session refresh error:", refreshError);
                }
                
                // Get the latest subscription data
                const { data: subscription, error: subError } = await supabase
                  .from('subscriptions')
                  .select('plan_type, status')
                  .eq('user_id', user.id)
                  .maybeSingle();
                
                if (subError) {
                  console.error("Error fetching subscription:", subError);
                  return false;
                }
                
                console.log(`Subscription status check (attempt ${attempts + 1}/${maxAttempts}):`, subscription);
                return subscription?.plan_type === 'pro' && subscription?.status === 'active';
              } catch (err) {
                console.error("Error in subscription check:", err);
                return false;
              }
            };
            
            const pollSubscription = async () => {
              let isSubscribed = await checkSubscriptionStatus();
              
              if (isSubscribed) {
                console.log("Pro subscription confirmed active!");
                if (mounted) {
                  toast({
                    title: "Subscription activated",
                    description: "You now have access to all pro features!",
                    duration: 5000,
                  });
                  
                  // Remove checkout_success from URL
                  const newUrl = location.pathname;
                  window.history.replaceState({}, document.title, newUrl);
                  
                  // Reload the page to ensure all components update with new subscription status
                  console.log("Reloading page to apply subscription changes");
                  window.location.reload();
                }
                return true;
              }
              
              if (attempts < maxAttempts - 1) {
                attempts++;
                console.log(`Subscription not active yet, waiting... (${attempts}/${maxAttempts})`);
                // Wait 5 seconds before next check (increased from 4)
                await new Promise(resolve => setTimeout(resolve, 5000));
                return pollSubscription();
              }
              
              console.log("Max attempts reached, subscription may not be active yet");
              return false;
            };
            
            // Start polling
            pollSubscription().then(success => {
              if (!success && mounted) {
                toast({
                  title: "Subscription processing",
                  description: "Your subscription is being processed. This may take a few minutes. Please reload the page to check again.",
                  duration: 10000,
                });
              }
            });
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
      
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session && mounted) {
        console.log(`Auth state changed: ${event}`);
        // Re-check everything when tokens are refreshed or user signs in
        await checkAuth();
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
