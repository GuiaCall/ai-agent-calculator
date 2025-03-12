
import { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function GDPRConsentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem('gdprConsent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdprConsent', 'accepted');
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gdprConsent', 'declined');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="rounded-t-xl max-w-full mx-auto sm:max-w-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-indigo-600 p-2 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <SheetTitle className="text-center text-xl">{t("gdpr.consentTitle")}</SheetTitle>
          <SheetDescription className="text-center">
            {t("gdpr.consentDescription")}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="bg-indigo-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">{t("gdpr.whatWeCollect")}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t("gdpr.collectItem1")}</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t("gdpr.collectItem2")}</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t("gdpr.collectItem3")}</span>
              </li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {t("gdpr.readMore")} <Link to="/privacy-policy" className="text-indigo-600 hover:underline">{t("gdpr.privacyPolicy")}</Link>, <Link to="/terms-of-service" className="text-indigo-600 hover:underline">{t("gdpr.termsOfService")}</Link> {t("gdpr.and")} <Link to="/cookie-policy" className="text-indigo-600 hover:underline">{t("gdpr.cookiePolicy")}</Link>.
          </p>
        </div>
        
        <SheetFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleDecline} className="sm:w-full">{t("gdpr.decline")}</Button>
          <Button onClick={handleAccept} className="sm:w-full bg-gradient-to-r from-indigo-600 to-purple-600">{t("gdpr.accept")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
