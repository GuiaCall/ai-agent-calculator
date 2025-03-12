
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";

export function LoadingState() {
  const { t } = useTranslation();
  
  return (
    <>
      <Navbar />
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">{t("loadingCalculatorData")}</p>
      </div>
      <Footer />
    </>
  );
}
