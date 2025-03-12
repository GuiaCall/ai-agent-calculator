
import { AgencyClientInfo } from "../AgencyClientInfo";
import { AgencyInfo, ClientInfo } from "@/types/invoice";

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
    <AgencyClientInfo
      agencyInfo={agencyInfo}
      clientInfo={clientInfo}
      onAgencyInfoChange={onAgencyInfoChange}
      onClientInfoChange={onClientInfoChange}
    />
  );
}
