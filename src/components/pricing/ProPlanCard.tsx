
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ProPlanCardProps {
  loading: boolean;
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleSubscribe: () => void;
  isCurrentPlan?: boolean;
}

export function ProPlanCard({ loading, couponCode, setCouponCode, handleSubscribe, isCurrentPlan = false }: ProPlanCardProps) {
  const { t } = useTranslation();
  const [showCouponInput, setShowCouponInput] = useState(false);

  return (
    <Card className={`p-8 border-2 hover:border-primary transition-all ${isCurrentPlan ? 'border-primary' : ''}`}>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-2xl font-bold">{t("proPlan")}</h3>
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full uppercase">
            {t("recommended")}
          </span>
        </div>
        <p className="text-gray-600 mb-6">{t("proPlanDescription")}</p>
        <div className="text-3xl font-bold">
          €9.99/<span className="text-xl text-gray-500">{t("month")}</span>
        </div>
      </div>

      <div className="space-y-5 mb-10">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("unlimitedInvoices")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("prioritySupport")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("advancedFeatures")}</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span>{t("earlyAccess")}</span>
        </div>
      </div>

      {!isCurrentPlan && (
        <>
          {showCouponInput && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t("haveCoupon")}</p>
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={t("enterCouponCode")}
                className="mb-2"
              />
            </div>
          )}

          <div className="space-y-2">
            <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("subscribeToPro")
              )}
            </Button>
            {!showCouponInput && (
              <Button variant="link" className="w-full" onClick={() => setShowCouponInput(true)}>
                {t("haveCouponQuestion")}
              </Button>
            )}
          </div>
        </>
      )}

      {isCurrentPlan && (
        <Button className="w-full" variant="outline" disabled>
          {t("currentPlan")}
        </Button>
      )}
    </Card>
  );
}
