import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useTranslation } from "react-i18next";

export function AuthLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg mr-2">
              <Calculator className="h-5 w-5" />
            </div>
            <div className="font-bold text-xl bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              {t("aiAgentCalculator")}
            </div>
          </div>
          <LanguageSelector />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 lg:py-12 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Login Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 inline-flex rounded-full mb-6">
                  <Calculator className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">{t("welcomeBack")}</h2>
                <p className="mt-2 text-gray-600">{t("signInPrompt")}</p>
              </div>
              
              <Auth 
                supabaseClient={supabase} 
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#4f46e5',
                        brandAccent: '#6366f1'
                      }
                    }
                  },
                  className: {
                    input: "p-3 rounded-lg border border-gray-300 w-full text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                    button: "p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full hover:opacity-90 transition-all font-medium",
                    anchor: "text-indigo-600 hover:text-indigo-800 font-medium",
                    message: "text-sm text-gray-600"
                  }
                }}
                providers={[]} 
                redirectTo={`${window.location.origin}/calculator`}
                onlyThirdPartyProviders={false}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: t("email"),
                      password_label: t("password")
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Right Column - Features Showcase */}
          <div className="order-1 lg:order-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                {t("aiAgentInvoiceGenerator")}
              </h1>
              <p className="text-lg text-gray-700 mb-10">
                {t("landingDescription")} {" "}
                <span className="font-semibold text-indigo-700">
                  {t("keyFeatures")}: {t("fastGeneration")}, {t("customizable")}, {t("pdfExport")}, {t("secure")}
                </span>
              </p>
            </div>
            
            {/* Invoice Preview Image */}
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/ca37e38c-d0f7-4e2e-a6bf-61a36559d8b8.png" 
                alt="Invoice Preview" 
                className="w-full h-auto"
              />
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                <h3 className="font-bold text-lg">{t("professionalInvoices")}</h3>
                <p>{t("impressClients")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-50 bg-white/80 backdrop-blur-md border-t border-indigo-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 w-4 rounded-full mr-2"></span>
            © {new Date().getFullYear()} {" "}
            <span className="mx-1 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t("aiAgentCalculator")}</span>
            {t("allRightsReserved")}
          </p>
        </div>
      </footer>
    </div>
  );
}
