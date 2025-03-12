
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";

export function TermsOfService() {
  const { t } = useTranslation();
  const currentDate = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("termsOfService.title")}</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">{t("termsOfService.lastUpdated", { date: currentDate })}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.agreement.title")}</h2>
            <p>{t("termsOfService.agreement.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.services.title")}</h2>
            <p>{t("termsOfService.services.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.accounts.title")}</h2>
            <p>{t("termsOfService.accounts.content1")}</p>
            <p>{t("termsOfService.accounts.content2")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.intellectualProperty.title")}</h2>
            <p>{t("termsOfService.intellectualProperty.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.userContent.title")}</h2>
            <p>{t("termsOfService.userContent.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.prohibitedUses.title")}</h2>
            <p>{t("termsOfService.prohibitedUses.content")}</p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>{t("termsOfService.prohibitedUses.item1")}</li>
              <li>{t("termsOfService.prohibitedUses.item2")}</li>
              <li>{t("termsOfService.prohibitedUses.item3")}</li>
              <li>{t("termsOfService.prohibitedUses.item4")}</li>
              <li>{t("termsOfService.prohibitedUses.item5")}</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.termination.title")}</h2>
            <p>{t("termsOfService.termination.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.disclaimer.title")}</h2>
            <p>{t("termsOfService.disclaimer.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.limitation.title")}</h2>
            <p>{t("termsOfService.limitation.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.indemnification.title")}</h2>
            <p>{t("termsOfService.indemnification.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.governingLaw.title")}</h2>
            <p>{t("termsOfService.governingLaw.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.changes.title")}</h2>
            <p>{t("termsOfService.changes.content")}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">{t("termsOfService.contact.title")}</h2>
            <p>{t("termsOfService.contact.content")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsOfService;
