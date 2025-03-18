
import { useTranslation } from "react-i18next";
import { Calculator, FileText, Server, Settings } from "lucide-react";
import React from "react";

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export function useNavigationItems() {
  const { t } = useTranslation();

  // Main navigation items
  const navItems: NavItem[] = [
    {
      id: 'calculator-header',
      title: t("agencyClientInfo"),
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'calculator-settings',
      title: t("calculatorSettings"),
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'technology-section',
      title: t("technologyStack"),
      icon: <Server className="h-5 w-5" />
    },
    {
      id: 'invoice-preview',
      title: t("invoicePreview"),
      icon: <Calculator className="h-5 w-5" />
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll to the element with smooth behavior
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close mobile menu after navigation
      if (window.innerWidth < 768) {
        // This will be handled by the component
      }
    }
  };

  // Scroll to a specific technology section
  const scrollToTechnology = (techId: string) => {
    const element = document.getElementById(`technology-${techId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { navItems, scrollToSection, scrollToTechnology };
}
