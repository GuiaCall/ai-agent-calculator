import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          await supabase.auth.signOut();
          navigate("/login", { replace: true });
          return;
        }

        if (!session) {
          navigate("/login", { replace: true });
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          await supabase.auth.signOut();
          navigate("/login", { replace: true });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        navigate("/login", { replace: true });
      } else if (event === "SIGNED_IN" && session) {
        setIsLoading(false);
      } else if (event === "TOKEN_REFRESHED" && !session) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}