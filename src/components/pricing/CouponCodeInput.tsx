
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface CouponCodeInputProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
}

export function CouponCodeInput({ couponCode, setCouponCode }: CouponCodeInputProps) {
  const { t } = useTranslation();
  
  return (
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
  );
}
