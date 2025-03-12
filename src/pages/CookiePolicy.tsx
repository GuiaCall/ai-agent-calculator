
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";

export function CookiePolicy() {
  const { t } = useTranslation();
  const currentDate = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("cookiePolicy.title")}</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">{t("cookiePolicy.lastUpdated", { date: currentDate })}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.introduction.title")}</h2>
            <p>{t("cookiePolicy.introduction.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.whatAreCookies.title")}</h2>
            <p>{t("cookiePolicy.whatAreCookies.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.typesOfCookies.title")}</h2>
            <p>{t("cookiePolicy.typesOfCookies.content")}</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">{t("cookiePolicy.typesOfCookies.essential.title")}</h3>
            <p>{t("cookiePolicy.typesOfCookies.essential.content")}</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">{t("cookiePolicy.typesOfCookies.preferences.title")}</h3>
            <p>{t("cookiePolicy.typesOfCookies.preferences.content")}</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">{t("cookiePolicy.typesOfCookies.analytics.title")}</h3>
            <p>{t("cookiePolicy.typesOfCookies.analytics.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.cookiesWeUse.title")}</h2>
            <p>{t("cookiePolicy.cookiesWeUse.content")}</p>
            
            <table className="min-w-full border border-gray-200 mt-4 mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border-b text-left">{t("cookiePolicy.cookiesWeUse.table.name")}</th>
                  <th className="px-4 py-2 border-b text-left">{t("cookiePolicy.cookiesWeUse.table.purpose")}</th>
                  <th className="px-4 py-2 border-b text-left">{t("cookiePolicy.cookiesWeUse.table.duration")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">gdprConsent</td>
                  <td className="px-4 py-2 border-b">{t("cookiePolicy.cookiesWeUse.table.gdprConsent")}</td>
                  <td className="px-4 py-2 border-b">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">cookieConsent</td>
                  <td className="px-4 py-2 border-b">{t("cookiePolicy.cookiesWeUse.table.cookieConsent")}</td>
                  <td className="px-4 py-2 border-b">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">auth-session</td>
                  <td className="px-4 py-2 border-b">{t("cookiePolicy.cookiesWeUse.table.authSession")}</td>
                  <td className="px-4 py-2 border-b">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">sb-*</td>
                  <td className="px-4 py-2 border-b">{t("cookiePolicy.cookiesWeUse.table.supabase")}</td>
                  <td className="px-4 py-2 border-b">Various</td>
                </tr>
              </tbody>
            </table>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.managingCookies.title")}</h2>
            <p>{t("cookiePolicy.managingCookies.content1")}</p>
            <p>{t("cookiePolicy.managingCookies.content2")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.changes.title")}</h2>
            <p>{t("cookiePolicy.changes.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("cookiePolicy.contact.title")}</h2>
            <p>{t("cookiePolicy.contact.content")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CookiePolicy;
