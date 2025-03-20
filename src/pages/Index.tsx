
import { Calculator } from "@/components/Calculator";
import { Calculator as CalculatorIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-6 transition-colors duration-300">
      <div className="container">
        <div className="text-center mb-8 mt-16">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <CalculatorIcon className="h-8 w-8 text-primary" />
            {t('title')}
          </h1>
          <p className="text-xl text-foreground/80">
            {t('subtitle')}
          </p>
        </div>
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
