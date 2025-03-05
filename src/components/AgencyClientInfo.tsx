
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { useTranslation } from "react-i18next";

interface AgencyClientInfoProps {
  onAgencyInfoChange: (info: AgencyInfo) => void;
  onClientInfoChange: (info: ClientInfo) => void;
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
}

export function AgencyClientInfo({
  onAgencyInfoChange,
  onClientInfoChange,
  agencyInfo,
  clientInfo,
}: AgencyClientInfoProps) {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">{t("agencyInformation")}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="agencyName">{t("agencyName")}</Label>
            <Input
              id="agencyName"
              value={agencyInfo.name}
              onChange={(e) => onAgencyInfoChange({ ...agencyInfo, name: e.target.value })}
              placeholder={t("agencyNamePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="agencyPhone">{t("phoneNumber")}</Label>
            <Input
              id="agencyPhone"
              value={agencyInfo.phone}
              onChange={(e) => onAgencyInfoChange({ ...agencyInfo, phone: e.target.value })}
              placeholder={t("phonePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="agencyAddress">{t("address")}</Label>
            <Input
              id="agencyAddress"
              value={agencyInfo.address}
              onChange={(e) => onAgencyInfoChange({ ...agencyInfo, address: e.target.value })}
              placeholder={t("addressPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="agencyEmail">{t("email")}</Label>
            <Input
              id="agencyEmail"
              type="email"
              value={agencyInfo.email}
              onChange={(e) => onAgencyInfoChange({ ...agencyInfo, email: e.target.value })}
              placeholder={t("emailPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="agencyWebsite">{t("website")}</Label>
            <Input
              id="agencyWebsite"
              value={agencyInfo.website}
              onChange={(e) => onAgencyInfoChange({ ...agencyInfo, website: e.target.value })}
              placeholder={t("websitePlaceholder")}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">{t("clientInformation")}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">{t("clientName")}</Label>
            <Input
              id="clientName"
              value={clientInfo.name}
              onChange={(e) => onClientInfoChange({ ...clientInfo, name: e.target.value })}
              placeholder={t("clientNamePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="clientAddress">{t("clientAddress")}</Label>
            <Input
              id="clientAddress"
              value={clientInfo.address}
              onChange={(e) => onClientInfoChange({ ...clientInfo, address: e.target.value })}
              placeholder={t("clientAddressPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="clientTVA">{t("tvaNumber")}</Label>
            <Input
              id="clientTVA"
              value={clientInfo.tvaNumber}
              onChange={(e) => onClientInfoChange({ ...clientInfo, tvaNumber: e.target.value })}
              placeholder={t("tvaPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="contactPersonName">{t("contactPersonName")}</Label>
            <Input
              id="contactPersonName"
              value={clientInfo.contactPerson.name}
              onChange={(e) => onClientInfoChange({
                ...clientInfo,
                contactPerson: { ...clientInfo.contactPerson, name: e.target.value }
              })}
              placeholder={t("contactPersonNamePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="contactPersonPhone">{t("contactPersonPhone")}</Label>
            <Input
              id="contactPersonPhone"
              value={clientInfo.contactPerson.phone}
              onChange={(e) => onClientInfoChange({
                ...clientInfo,
                contactPerson: { ...clientInfo.contactPerson, phone: e.target.value }
              })}
              placeholder={t("contactPersonPhonePlaceholder")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
