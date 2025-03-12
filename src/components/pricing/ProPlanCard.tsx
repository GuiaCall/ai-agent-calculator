
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CouponCodeInput } from "./CouponCodeInput";
import { SubscribeButton } from "./SubscribeButton";

interface ProPlanCardProps {
  isSubscribed: boolean;
  subscriptionStatus: string;
  couponCode: string;
  setCouponCode: (value: string) => void;
  loading: boolean;
  handleSubscribe: () => void;
}

export function ProPlanCard({ 
  isSubscribed, 
  subscriptionStatus, 
  couponCode, 
  setCouponCode, 
  loading, 
  handleSubscribe 
}: ProPlanCardProps) {
  const { t } = useTranslation();
  
  return (
    <Card className={`p-8 border-2 ${isSubscribed && subscriptionStatus === 'active' ? 'border-primary bg-primary/5' : ''} hover:bg-primary/10 transition-all`}>
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-3">{t("proPlan")}</h3>
        <p className="text-gray-600 mb-6">{t("proPlanDescription")}</p>
        <div className="text-3xl font-bold">
          €7.99/<span className="text-xl text-gray-500">{t("month")}</span>
        </div>
      </div>

      <div className="space-y-5 mb-10">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("generateUnlimitedInvoices")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("accessToAllFeatures")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("futureFeatureUpgrades")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("pdfExportFunctionality")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("accessToAllSavedInvoices")}</span>
        </div>
      </div>
      
      {isSubscribed && subscriptionStatus === 'active' ? (
        <Button className="w-full" variant="outline" disabled>
          {t("currentPlan")}
        </Button>
      ) : isSubscribed && subscriptionStatus !== 'active' ? (
        <>
          <CouponCodeInput couponCode={couponCode} setCouponCode={setCouponCode} />
          <SubscribeButton loading={loading} onClick={handleSubscribe} isReactivation={true} />
        </>
      ) : (
        <>
          <CouponCodeInput couponCode={couponCode} setCouponCode={setCouponCode} />
          <SubscribeButton loading={loading} onClick={handleSubscribe} />
        </>
      )}
    </Card>
  );
}
