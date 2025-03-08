
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface SubscriptionCardProps {
  subscription: {
    plan_type: string;
    status: string;
  };
  onRefreshStatus: () => void;
  refreshingStatus: boolean;
}

export function SubscriptionCard({ 
  subscription, 
  onRefreshStatus, 
  refreshingStatus 
}: SubscriptionCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{t("currentPlan")}</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefreshStatus}
          disabled={refreshingStatus}
          className="flex items-center gap-2"
        >
          {refreshingStatus ? (
            <div className="flex items-center gap-1">
              <span className="text-xs">{t("refreshing")}</span>
              <RefreshCw className="h-3 w-3 animate-spin" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs">{t("refresh")}</span>
              <RefreshCw className="h-3 w-3" />
            </div>
          )}
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold capitalize">{subscription.plan_type}</p>
          {subscription.plan_type === 'pro' && subscription.status === 'active' && (
            <div className="flex items-center text-green-500 mt-1">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span className="text-sm">{t("subscriptionActive")}</span>
            </div>
          )}
          {subscription.plan_type === 'pro' && subscription.status !== 'active' && (
            <div className="flex items-center text-amber-500 mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{t("subscriptionInactive")}</span>
            </div>
          )}
        </div>
        {(subscription.plan_type === 'free' || subscription.status !== 'active') && (
          <Button onClick={() => navigate('/pricing')} variant="default">
            {t("upgradePlan")}
          </Button>
        )}
      </div>
    </Card>
  );
}
