
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { CurrencyType } from "@/components/calculator/CalculatorState";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface InvoicePreviewProps {
  agencyInfo: AgencyInfo;
  clientInfo: ClientInfo;
  totalMinutes: number;
  totalCost: number | null;
  setupCost: number | null;
  taxRate: number;
  themeColor: string;
  currency: CurrencyType;
  invoiceNumber?: string;
  callDuration?: number;
  technologies?: { name: string; isSelected: boolean }[];
}

export function InvoicePreview({
  agencyInfo,
  clientInfo,
  totalMinutes,
  totalCost,
  setupCost,
  taxRate,
  themeColor,
  currency,
  invoiceNumber,
  callDuration = 0,
  technologies = [],
}: InvoicePreviewProps) {
  const { t } = useTranslation();
  
  const getCurrencySymbol = (currency: CurrencyType) => {
    switch (currency) {
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };
  
  const currencySymbol = getCurrencySymbol(currency);
  const costPerMinute = totalCost && totalMinutes ? totalCost / totalMinutes : 0;
  const taxAmount = (totalCost || 0) * (taxRate / 100);
  const total = (totalCost || 0) * (1 + taxRate / 100) + (setupCost || 0);
  
  const currentYear = new Date().getFullYear();
  const dynamicInvoiceNumber = invoiceNumber || `INV-${currentYear}-0001`;
  
  const currentDate = format(new Date(), 'dd MMM yyyy');
  const dueDate = format(new Date(new Date().setDate(new Date().getDate() + 30)), 'dd MMM yyyy');

  // Get selected technologies
  const selectedTechs = technologies.filter(tech => tech.isSelected).map(tech => tech.name);
  
  return (
    <div className="max-w-[210mm] mx-auto bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden print:shadow-none">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t("invoice")}</h1>
            <p className="text-indigo-100 mt-1">#{dynamicInvoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold">{agencyInfo.name}</h2>
            <p className="text-indigo-100">{agencyInfo.website}</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 bg-white">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{t("billTo")}:</h3>
            <div className="space-y-1 text-gray-600">
              <p className="font-medium text-gray-800">{clientInfo.name}</p>
              <p>{clientInfo.address}</p>
              <p>{t("tvaNumber")}: {clientInfo.tvaNumber}</p>
              <p>{t("contact")}: {clientInfo.contactPerson.name}</p>
              <p>{t("phone")}: {clientInfo.contactPerson.phone}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-1 text-gray-500">{t("invoiceDate").toUpperCase()}</h3>
                <p className="text-gray-800">{currentDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1 text-gray-500">{t("dueDate").toUpperCase()}</h3>
                <p className="text-gray-800">{dueDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1 text-gray-500">{t("amountDue").toUpperCase()}</h3>
                <p className="text-xl font-bold text-indigo-600">{currencySymbol}{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service details section including call duration and total minutes */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">{t("serviceDetails")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t("averageCallDuration")}</p>
              <p className="text-gray-800">{callDuration} {t("minutes")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t("totalMinutesPerMonth")}</p>
              <p className="text-gray-800">{totalMinutes} {t("minutes")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t("costPerMinute")}</p>
              <p className="text-gray-800">{currencySymbol}{costPerMinute.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {/* Technology Stack section */}
        {selectedTechs.length > 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{t("technologyStack")}</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTechs.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-medium">
                <th className="py-3 px-4 border-b border-gray-200">{t("description").toUpperCase()}</th>
                <th className="py-3 px-4 border-b border-gray-200">{t("quantity").toUpperCase()}</th>
                <th className="py-3 px-4 border-b border-gray-200">{t("rate").toUpperCase()}</th>
                <th className="py-3 px-4 border-b border-gray-200 text-right">{t("amount").toUpperCase()}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {setupCost && setupCost > 0 && (
                <tr className="text-gray-700">
                  <td className="py-4 px-4">
                    <div className="font-medium">{t("setupCost")}</div>
                    <div className="text-sm text-gray-500">{t("setupDescription")}</div>
                  </td>
                  <td className="py-4 px-4">1</td>
                  <td className="py-4 px-4">{currencySymbol}{setupCost.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">{currencySymbol}{setupCost.toFixed(2)}</td>
                </tr>
              )}
              <tr className="text-gray-700">
                <td className="py-4 px-4">
                  <div className="font-medium">{t("aiVoiceService")}</div>
                  <div className="text-sm text-gray-500">{t("monthlySubscription")}</div>
                </td>
                <td className="py-4 px-4">{totalMinutes} {t("minutes")}</td>
                <td className="py-4 px-4">{currencySymbol}{costPerMinute.toFixed(4)}/{t("min")}</td>
                <td className="py-4 px-4 text-right">{currencySymbol}{(totalCost || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex justify-end">
            <div className="w-1/2 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>{t("subtotal")}</span>
                <span>{currencySymbol}{((totalCost || 0) + (setupCost || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t("tax")} ({taxRate}%)</span>
                <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-indigo-600 pt-3 border-t border-gray-200">
                <span>{t("total")}</span>
                <span>{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm space-y-2">
            <p className="font-medium text-gray-600">{t("thankYou")}</p>
            <div className="pt-2">
              <p>{agencyInfo.name}</p>
              <p>{agencyInfo.address}</p>
              <p>{agencyInfo.email} | {agencyInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
