
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface ProPlanCardProps {
  loading: boolean;
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleSubscribe: () => Promise<void>;
}

export function ProPlanCard({ 
  loading,
  couponCode,
  setCouponCode,
  handleSubscribe 
}: ProPlanCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-8 border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
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
      
      <div className="mb-4">
        <Label htmlFor="couponCode" className="mb-2 block">
          {t("couponCode")}
        </Label>
        <Input
          id="couponCode"
          placeholder={t("enterCouponCode")}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="mb-4"
        />
      </div>

      <Button 
        className="w-full" 
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("processing")}
          </span>
        ) : (
          t("upgradeToPro")
        )}
      </Button>
    </Card>
  );
}
