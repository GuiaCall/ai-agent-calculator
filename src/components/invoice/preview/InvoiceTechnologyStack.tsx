
import { useTranslation } from "react-i18next";

interface InvoiceTechnologyStackProps {
  technologies: { name: string; isSelected: boolean }[];
}

export function InvoiceTechnologyStack({ technologies }: InvoiceTechnologyStackProps) {
  const { t } = useTranslation();
  
  // Get selected technologies
  const selectedTechs = technologies.filter(tech => tech.isSelected).map(tech => tech.name);
  
  if (selectedTechs.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100 print:break-inside-avoid print:text-xs">
      <h3 className="text-base font-semibold mb-1 text-gray-700 print:text-xs">{t("technologyStack")}</h3>
      <div className="flex flex-wrap gap-1">
        {selectedTechs.map((tech, index) => (
          <span key={index} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs print:text-[9px] print:py-0">
            {t(tech)}
          </span>
        ))}
      </div>
    </div>
  );
}
