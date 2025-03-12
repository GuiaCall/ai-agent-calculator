
import { useTranslation } from "react-i18next";

export function AuthFeatures() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
        {t("aiAgentInvoiceGenerator")}
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        {t("landingDescription")} {" "}
        <span className="font-semibold text-indigo-700">
          {t("keyFeatures")}: {t("fastGeneration")}, {t("customizable")}, {t("pdfExport")}, {t("secure")}
        </span>
      </p>
      
      {/* Invoice Preview Image */}
      <div className="rounded-xl overflow-hidden shadow-xl">
        <img 
          src="/lovable-uploads/ca37e38c-d0f7-4e2e-a6bf-61a36559d8b8.png" 
          alt="Invoice Preview" 
          className="w-full h-auto"
        />
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <h3 className="font-bold text-lg">{t("professionalInvoices")}</h3>
          <p>{t("impressClients")}</p>
        </div>
      </div>
    </div>
  );
}
