import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          navigate("/login");
          return;
        }

        if (!session) {
          navigate("/login");
          return;
        }

        if (!session.user.email_confirmed_at) {
          toast({
            title: "Email verification required",
            description: "Please verify your email address to continue.",
            variant: "destructive",
          });
          navigate("/pricing");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/login");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (event === "SIGNED_IN" && session) {
        if (!session.user.email_confirmed_at) {
          toast({
            title: "Email verification required",
            description: "Please verify your email address to continue.",
            variant: "destructive",
          });
          navigate("/pricing");
          return;
        }
        setIsLoading(false);
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}