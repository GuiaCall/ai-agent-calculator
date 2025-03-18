
import React, { useState, useEffect } from 'react';
import { FileText, Settings, Server, Calculator, Layers } from 'lucide-react';
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
  
  // Define navigation items with proper icons
  const navItems = [
    {
      id: 'calculator-header',
      title: "Agency & Client Info",
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'calculator-settings',
      title: "Calculator Settings",
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'technology-section',
      title: "Technology Stack",
      icon: <Server className="h-5 w-5" />
    },
    {
      id: 'invoice-preview',
      title: "Invoice Preview",
      icon: <Calculator className="h-5 w-5" />
    }
  ];
  
  // Local state for active section
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Define scroll functions
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

  // Add event listeners for auto-collapse
  useEffect(() => {
    const handleAutoCollapse = () => {
      if (!isCollapsed) {
        setIsCollapsed(true);
      }
    };

    // Debounce function to avoid excessive calls
    let timeout: NodeJS.Timeout;
    const debouncedHandleAutoCollapse = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleAutoCollapse, 1500);
    };

    // Add event listeners for scroll, wheel, and keyboard events
    window.addEventListener('wheel', debouncedHandleAutoCollapse);
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        debouncedHandleAutoCollapse();
      }
    });

    return () => {
      window.removeEventListener('wheel', debouncedHandleAutoCollapse);
      window.removeEventListener('keydown', debouncedHandleAutoCollapse);
      clearTimeout(timeout);
    };
  }, [isCollapsed]);

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
