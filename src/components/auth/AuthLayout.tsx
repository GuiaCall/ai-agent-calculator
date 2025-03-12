
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";
import { AuthFeatures } from "./AuthFeatures";
import { Footer } from "@/components/layout/Footer";
import { GDPRConsentPopup } from "@/components/gdpr/GDPRConsentPopup";
import { CookieConsentBanner } from "@/components/gdpr/CookieConsentBanner";

export function AuthLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <AuthHeader />

      <div className="container mx-auto px-4 py-8 lg:py-12 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Login Form */}
          <div className="order-2 lg:order-1">
            <AuthForm />
          </div>
          
          {/* Right Column - Features Showcase */}
          <div className="order-1 lg:order-2">
            <AuthFeatures />
          </div>
        </div>
      </div>

      <Footer />
      <GDPRConsentPopup />
      <CookieConsentBanner />
    </div>
  );
}
