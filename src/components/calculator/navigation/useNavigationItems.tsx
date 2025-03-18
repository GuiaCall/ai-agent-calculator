
import { useTranslation } from "react-i18next";
import { Calculator, FileText, Server, Settings } from "lucide-react";
import React, { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export function useNavigationItems() {
  const { t } = useTranslation();
  const { setOpen, setOpenMobile } = useSidebar();

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
      
      // Close sidebar after navigation
      setOpen(false);
      setOpenMobile(false);
    }
  };

  // Scroll to a specific technology section
  const scrollToTechnology = (techId: string) => {
    const element = document.getElementById(`technology-${techId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close sidebar after navigation
      setOpen(false);
      setOpenMobile(false);
    }
  };

  // Set up event listeners to collapse sidebar on manual navigation
  useEffect(() => {
    const handleScroll = () => {
      // Close the sidebar when user manually scrolls
      setOpen(false);
      setOpenMobile(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close the sidebar when user uses arrow keys for navigation
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setOpen(false);
        setOpenMobile(false);
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listeners
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setOpen, setOpenMobile]);

  return { navItems, scrollToSection, scrollToTechnology };
}
