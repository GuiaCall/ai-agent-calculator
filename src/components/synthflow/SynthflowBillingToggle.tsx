
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

interface SynthflowBillingToggleProps {
  billingType: 'monthly' | 'yearly';
  onToggle: () => void;
}

export function SynthflowBillingToggle({ billingType, onToggle }: SynthflowBillingToggleProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${billingType === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
        {t("monthly")}
      </span>
      <Switch 
        checked={billingType === 'yearly'} 
        onCheckedChange={onToggle} 
      />
      <span className={`text-sm ${billingType === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
        {t("yearly")}
      </span>
    </div>
  );
}
