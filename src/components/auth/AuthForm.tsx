
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function AuthForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_UP") {
        toast({
          title: t("accountCreated"),
          description: t("pleaseCheckYourEmail"),
          className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
        });
      } else if (event === "USER_UPDATED") {
        toast({
          title: t("emailConfirmed"),
          description: t("welcomeToApp"),
          className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [t, toast]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 inline-flex rounded-full mb-6">
          <Calculator className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{t("login")}</h2>
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
            message: "p-4 mb-4 rounded-lg border text-sm"
          }
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: t("emailAddress"),
              password_label: t("password"),
              email_input_placeholder: t("enterEmail"),
              password_input_placeholder: t("enterPassword"),
              button_label: t("login"),
              loading_button_label: t("signingIn"),
              social_provider_text: t("signInWith"),
              link_text: t("forgotPassword"),
            },
            sign_up: {
              email_label: t("emailAddress"),
              password_label: t("password"),
              email_input_placeholder: t("enterEmail"),
              password_input_placeholder: t("enterPassword"),
              button_label: t("signUp"),
              loading_button_label: t("signingUp"),
              social_provider_text: t("signUpWith"),
              confirmation_text: t("checkEmailForLink"),
            },
          },
        }}
        providers={[]} 
        redirectTo={`${window.location.origin}/calculator`}
        onlyThirdPartyProviders={false}
      />
    </div>
  );
}
