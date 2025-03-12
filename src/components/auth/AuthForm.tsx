
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
      if (event === 'SIGNED_UP') {
        toast({
          title: t("auth.accountCreated"),
          description: t("auth.pleaseCheckYourEmail"),
          className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
        });
      } else if (event === 'USER_UPDATED') {
        toast({
          title: t("auth.emailConfirmed"),
          description: t("auth.welcomeToApp"),
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
            message: "p-4 mb-4 rounded-lg border text-sm"
          }
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: t("auth.emailAddress"),
              password_label: t("auth.password"),
              email_input_placeholder: t("auth.enterEmail"),
              password_input_placeholder: t("auth.enterPassword"),
              button_label: t("auth.login"),
              loading_button_label: t("auth.signingIn"),
              social_provider_text: t("auth.signInWith"),
              link_text: t("auth.forgotPassword"),
            },
            sign_up: {
              email_label: t("auth.emailAddress"),
              password_label: t("auth.password"),
              email_input_placeholder: t("auth.enterEmail"),
              password_input_placeholder: t("auth.enterPassword"),
              button_label: t("auth.signUp"),
              loading_button_label: t("auth.signingUp"),
              social_provider_text: t("auth.signUpWith"),
              confirmation_text: t("auth.checkEmailForLink"),
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
