
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

export function LegalDisclaimer() {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const acknowledged = localStorage.getItem('legalDisclaimerAcknowledged');
    if (acknowledged) {
      setIsAcknowledged(true);
    } else {
      setShowAlert(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('legalDisclaimerAcknowledged', 'true');
    setIsAcknowledged(true);
    setShowAlert(false);
  };

  if (isAcknowledged || !showAlert) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("legalDisclaimer.title")}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">{t("legalDisclaimer.shortDescription")}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                {t("legalDisclaimer.readMore")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("legalDisclaimer.fullTitle")}</AlertDialogTitle>
                <AlertDialogDescription className="max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4 text-sm">
                    <p>{t("legalDisclaimer.paragraph1")}</p>
                    <p>{t("legalDisclaimer.paragraph2")}</p>
                    <p>{t("legalDisclaimer.paragraph3")}</p>
                    <p>{t("legalDisclaimer.paragraph4")}</p>
                    <p>{t("legalDisclaimer.paragraph5")}</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("legalDisclaimer.close")}</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
            onClick={handleAcknowledge}
          >
            {t("legalDisclaimer.acknowledge")}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
