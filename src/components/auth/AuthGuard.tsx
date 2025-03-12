
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/layout/PageLoader";

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
            const maxAttempts = 30; // Increased from 20
            const checkSubscriptionStatus = async (): Promise<boolean> => {
              try {
                // Force refresh the session to ensure we have the latest token
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                if (refreshError) {
                  console.error("Session refresh error:", refreshError);
                }
                
                // Get the latest subscription data with delay between attempts
                await new Promise(resolve => setTimeout(resolve, 1000));
                
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
                  
                  // Force reload the page to ensure all components update with new subscription status
                  console.log("Reloading page to apply subscription changes");
                  window.location.reload();
                }
                return true;
              }
              
              if (attempts < maxAttempts - 1) {
                attempts++;
                console.log(`Subscription not active yet, waiting... (${attempts}/${maxAttempts})`);
                // Wait 6 seconds between checks (increased from 5)
                await new Promise(resolve => setTimeout(resolve, 6000));
                return pollSubscription();
              }
              
              console.log("Max attempts reached, subscription may not be active yet");
              if (mounted) {
                toast({
                  title: "Subscription processing",
                  description: "Your subscription is still being processed. Please reload the page in a minute to check again.",
                  duration: 8000,
                });
                
                // Remove checkout_success from URL
                const newUrl = location.pathname;
                window.history.replaceState({}, document.title, newUrl);
              }
              return false;
            };
            
            // Start polling
            pollSubscription();
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
    return <PageLoader />;
  }

  return <>{children}</>;
}
