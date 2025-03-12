
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
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
