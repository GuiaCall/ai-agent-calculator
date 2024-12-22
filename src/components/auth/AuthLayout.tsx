import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calculator } from "lucide-react";

interface AuthLayoutProps {
  mode: "login" | "signup";
  children: React.ReactNode;
}

export function AuthLayout({ mode, children }: AuthLayoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsLoading(false);
          return;
        }

        if (session) {
          navigate("/calculator");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/calculator");
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calculator className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground font-heading">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {mode === "login" 
              ? "Sign in to your account to access your calculator and manage your invoices."
              : "Join us to start creating professional invoices and managing your business efficiently."
            }
          </p>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-lg border">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(37, 99, 235)',
                    brandAccent: 'rgb(29, 78, 216)',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/calculator`}
            view={mode === "login" ? "sign_in" : "sign_up"}
          />
        </div>
      </div>
    </div>
  );
}