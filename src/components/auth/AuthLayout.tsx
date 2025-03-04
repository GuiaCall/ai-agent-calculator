
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
  const [logoError, setLogoError] = useState(false);
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
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleResendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      if (error) throw error;
      toast({
        title: "Confirmation email sent",
        description: "Please check your email for the confirmation link"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  
  return <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm inline-block mb-6">
            {logoError ? <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center text-primary font-bold text-xl">
                App
              </div> : <img src="/placeholder.svg" alt="Logo" className="mx-auto h-16 w-auto" onError={() => setLogoError(true)} />}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account to create AI Agent Invoices</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Auth supabaseClient={supabase} appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8'
              }
            }
          },
          className: {
            input: "p-2 border rounded w-full text-foreground",
            button: "p-2 rounded bg-primary text-white w-full hover:bg-primary/90",
            anchor: "text-primary hover:text-primary/80",
            message: "text-sm text-foreground/80"
          }
        }} providers={[]} redirectTo={`${window.location.origin}/calculator`} onlyThirdPartyProviders={false} localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password'
            }
          }
        }} />
        </div>
      </div>
    </div>;
}
