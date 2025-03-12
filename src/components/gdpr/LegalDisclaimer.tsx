
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
import { supabase } from "@/integrations/supabase/client";

export function LegalDisclaimer() {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAcknowledgment = async () => {
      try {
        // First check local storage for immediate UI feedback
        const localAcknowledged = localStorage.getItem('legalDisclaimerAcknowledged');
        if (localAcknowledged) {
          setIsAcknowledged(true);
          setShowAlert(false);
          return;
        }

        // Check user authentication status
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // If authenticated, check database acknowledgment
          try {
            const { data, error } = await supabase
              .from('user_consent')
              .select('legal_disclaimer_acknowledged')
              .eq('user_id', session.user.id)
              .single();

            if (error) {
              console.error("Error checking legal disclaimer acknowledgment:", error);
              setShowAlert(true);
              return;
            }

            if (data?.legal_disclaimer_acknowledged) {
              // User has already acknowledged in database
              setIsAcknowledged(true);
              setShowAlert(false);
              localStorage.setItem('legalDisclaimerAcknowledged', 'true');
              return;
            }
          } catch (dbError) {
            console.error("Database error in legal disclaimer check:", dbError);
          }
        }

        // If not acknowledged in either local storage or database, show alert
        setShowAlert(true);
      } catch (error) {
        console.error("Error in legal disclaimer check:", error);
        setShowAlert(true);
      }
    };

    checkAcknowledgment();
  }, []);

  const handleAcknowledge = async () => {
    localStorage.setItem('legalDisclaimerAcknowledged', 'true');
    setIsAcknowledged(true);
    setShowAlert(false);

    try {
      // Update the database if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_consent')
          .upsert({
            user_id: session.user.id,
            legal_disclaimer_acknowledged: true,
            last_updated: new Date().toISOString()
          })
          .select();
      }
    } catch (error) {
      console.error("Error saving legal disclaimer acknowledgment:", error);
    }
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
