
import React, { useState } from 'react';
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useCalculatorStateContext } from './CalculatorStateContext';

export function NavigationSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { technologies } = useCalculatorStateContext();
  
  // Get active technologies for the navigation
  const activeTechnologies = technologies
    .filter(tech => tech.isSelected)
    .map(tech => ({ id: tech.id, name: tech.name }));
  
  // Define navigation items locally to avoid dependency on useSidebar
  const navItems = [
    {
      id: 'calculator-header',
      title: "Agency & Client Info",
      icon: "FileText"
    },
    {
      id: 'calculator-settings',
      title: "Calculator Settings",
      icon: "Settings"
    },
    {
      id: 'technology-section',
      title: "Technology Stack",
      icon: "Server"
    },
    {
      id: 'invoice-preview',
      title: "Invoice Preview",
      icon: "Calculator"
    }
  ];
  
  // Local state for active section
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Define scroll functions locally
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };
  
  const scrollToTechnology = (techId: string) => {
    const element = document.getElementById(`technology-${techId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection('technology-section');
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <DesktopNavigation 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeSection={activeSection}
          navItems={navItems}
          activeTechnologies={activeTechnologies}
          scrollToSection={scrollToSection}
          scrollToTechnology={scrollToTechnology}
        />
      </div>
      <div className="md:hidden">
        <MobileNavigation 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          activeSection={activeSection}
          navItems={navItems}
          activeTechnologies={activeTechnologies}
          scrollToSection={scrollToSection}
          scrollToTechnology={scrollToTechnology}
        />
      </div>
    </>
  );
}
