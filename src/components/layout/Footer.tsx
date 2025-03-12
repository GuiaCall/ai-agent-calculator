
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AI-Agent Calculator. {t("allRightsReserved")}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              {t("gdpr.privacyPolicy")}
            </Link>
            <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              {t("gdpr.termsOfService")}
            </Link>
            <Link to="/cookie-policy" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              {t("gdpr.cookiePolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
