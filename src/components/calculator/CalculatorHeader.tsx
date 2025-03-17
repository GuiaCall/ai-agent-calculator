
import { AgencyClientInfo } from "../AgencyClientInfo";
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { Card } from "@/components/ui/card";

export function CalculatorHeader({ 
  agencyInfo, 
  clientInfo, 
  onAgencyInfoChange, 
  onClientInfoChange 
}: {
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
  onAgencyInfoChange: (info: AgencyInfo) => void;
  onClientInfoChange: (info: ClientInfo) => void;
}) {
  return (
    <Card className="p-6 bg-background text-foreground">
      <AgencyClientInfo
        agencyInfo={agencyInfo}
        clientInfo={clientInfo}
        onAgencyInfoChange={onAgencyInfoChange}
        onClientInfoChange={onClientInfoChange}
      />
    </Card>
  );
}
