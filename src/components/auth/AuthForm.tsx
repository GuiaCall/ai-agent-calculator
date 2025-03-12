
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AuthForm() {
  const { t } = useTranslation();
  
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
  );
}
