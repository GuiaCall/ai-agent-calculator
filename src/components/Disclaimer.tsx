
import { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";

export function Disclaimer() {
  const [isAccepted, setIsAccepted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (accepted) {
      setIsAccepted(true);
    }
  }, []);

  const handleAccept = (checked: boolean) => {
    setIsAccepted(checked);
    if (checked) {
      localStorage.setItem('disclaimerAccepted', 'true');
    }
  };

  if (isAccepted) return null;

  return (
    <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t("disclaimerText")}
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="disclaimer"
            checked={isAccepted}
            onCheckedChange={handleAccept}
          />
          <Label htmlFor="disclaimer">
            {t("disclaimerAccept")}
          </Label>
        </div>
      </div>
    </Card>
  );
}
