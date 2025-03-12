
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
