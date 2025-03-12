
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkConsent = async () => {
      try {
        // First check local storage for immediate UI feedback
        const localConsent = localStorage.getItem('cookieConsent');
        if (localConsent) {
          setShowBanner(false);
          return;
        }

        // Check user authentication status
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // If authenticated, check database consent
          try {
            const { data, error } = await supabase
              .from('user_consent')
              .select('cookie_consent')
              .eq('user_id', session.user.id)
              .single();

            if (error) {
              console.error("Error checking cookie consent:", error);
              setShowBanner(true);
              return;
            }

            if (data?.cookie_consent) {
              // User has already consented in database
              setShowBanner(false);
              localStorage.setItem('cookieConsent', 'accepted');
              return;
            }
          } catch (dbError) {
            console.error("Database error in cookie consent check:", dbError);
          }
        }

        // If no consent found in either local storage or database, show banner
        setShowBanner(true);
      } catch (error) {
        console.error("Error in consent check:", error);
        setShowBanner(true);
      }
    };

    checkConsent();
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);

    try {
      // Update the database if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_consent')
          .upsert({
            user_id: session.user.id,
            cookie_consent: true,
            consent_date: new Date().toISOString(),
            last_updated: new Date().toISOString()
          })
          .select();
      }
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  const handleDecline = async () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);

    try {
      // Update the database if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_consent')
          .upsert({
            user_id: session.user.id,
            cookie_consent: false,
            consent_date: new Date().toISOString(),
            last_updated: new Date().toISOString()
          })
          .select();
      }
    } catch (error) {
      console.error("Error saving cookie consent decline:", error);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-indigo-100 p-4 z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium">{t("cookie.title")}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {t("cookie.description")} <Link to="/cookie-policy" className="text-indigo-600 hover:underline">{t("cookie.learnMore")}</Link>
            </p>
          </div>
          <div className="flex gap-3 self-end md:self-auto">
            <Button variant="outline" size="sm" onClick={handleDecline}>
              {t("cookie.decline")}
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600" onClick={handleAccept}>
              {t("cookie.accept")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
