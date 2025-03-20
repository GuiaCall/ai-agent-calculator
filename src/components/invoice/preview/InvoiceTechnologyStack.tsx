
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
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 print:break-inside-avoid print:text-xs">
      <h3 className="text-lg font-semibold mb-2 text-gray-700 print:text-sm">{t("technologyStack")}</h3>
      <div className="flex flex-wrap gap-2">
        {selectedTechs.map((tech, index) => (
          <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm print:text-xs print:py-0.5">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
