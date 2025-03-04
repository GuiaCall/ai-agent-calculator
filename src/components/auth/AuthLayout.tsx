
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuthLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

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

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Confirmation email sent",
        description: "Please check your email for the confirmation link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm inline-block mb-4">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="mx-auto h-12 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
                target.onerror = null;
              }}
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                input: "p-2 border rounded w-full text-foreground",
                button: "p-2 rounded bg-primary text-white w-full hover:bg-primary/90",
                anchor: "text-primary hover:text-primary/80",
                message: "text-sm text-foreground/80",
              }
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/calculator`}
            onlyThirdPartyProviders={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                },
              },
            }}
          />
          <div className="mt-4 text-center space-y-2">
            <button
              onClick={() => handlePasswordReset(email)}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
            <button
              onClick={() => handleResendConfirmation(email)}
              className="block w-full text-sm text-primary hover:underline"
            >
              Resend confirmation email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
