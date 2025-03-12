
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";

export function PrivacyPolicy() {
  const { t } = useTranslation();
  const currentDate = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("privacyPolicy.title")}</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">{t("privacyPolicy.lastUpdated", { date: currentDate })}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.introduction.title")}</h2>
            <p>{t("privacyPolicy.introduction.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.dataCollection.title")}</h2>
            <p>{t("privacyPolicy.dataCollection.content")}</p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>{t("privacyPolicy.dataCollection.item1")}</li>
              <li>{t("privacyPolicy.dataCollection.item2")}</li>
              <li>{t("privacyPolicy.dataCollection.item3")}</li>
              <li>{t("privacyPolicy.dataCollection.item4")}</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.dataUse.title")}</h2>
            <p>{t("privacyPolicy.dataUse.content")}</p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>{t("privacyPolicy.dataUse.item1")}</li>
              <li>{t("privacyPolicy.dataUse.item2")}</li>
              <li>{t("privacyPolicy.dataUse.item3")}</li>
              <li>{t("privacyPolicy.dataUse.item4")}</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.dataSharing.title")}</h2>
            <p>{t("privacyPolicy.dataSharing.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.dataRetention.title")}</h2>
            <p>{t("privacyPolicy.dataRetention.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.userRights.title")}</h2>
            <p>{t("privacyPolicy.userRights.content")}</p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>{t("privacyPolicy.userRights.item1")}</li>
              <li>{t("privacyPolicy.userRights.item2")}</li>
              <li>{t("privacyPolicy.userRights.item3")}</li>
              <li>{t("privacyPolicy.userRights.item4")}</li>
              <li>{t("privacyPolicy.userRights.item5")}</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.security.title")}</h2>
            <p>{t("privacyPolicy.security.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.thirdPartyLinks.title")}</h2>
            <p>{t("privacyPolicy.thirdPartyLinks.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.childrenPrivacy.title")}</h2>
            <p>{t("privacyPolicy.childrenPrivacy.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.changes.title")}</h2>
            <p>{t("privacyPolicy.changes.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("privacyPolicy.contact.title")}</h2>
            <p>{t("privacyPolicy.contact.content")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
