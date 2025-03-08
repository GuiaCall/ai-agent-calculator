
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AccountInfoCardProps {
  userEmail: string;
}

export function AccountInfoCard({ userEmail }: AccountInfoCardProps) {
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const handlePasswordChange = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: t("passwordUpdated"),
        description: t("passwordUpdateSuccess"),
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: t("errorUpdatingPassword"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg font-semibold">{t("accountInformation")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div>
          <p className="text-sm text-gray-500">{t("email")}</p>
          <p className="font-medium">{userEmail}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{t("changePassword")}</p>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("newPasswordPlaceholder")}
          />
          <Button onClick={handlePasswordChange}>
            {t("updatePassword")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
