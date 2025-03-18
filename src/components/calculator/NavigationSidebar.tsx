
import React, { useState } from 'react';
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useNavigationItems } from './navigation/useNavigationItems';
import { useCalculatorStateContext } from './CalculatorStateContext';

export function NavigationSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { technologies } = useCalculatorStateContext();
  
  // Get active technologies for the navigation
  const activeTechnologies = technologies
    .filter(tech => tech.isSelected)
    .map(tech => ({ id: tech.id, name: tech.name }));
  
  // Handle scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll to technology
  const scrollToTechnology = (techId: string) => {
    const element = document.getElementById(`technology-${techId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get navigation items
  const { navItems, activeSection } = useNavigationItems();

  // We're wrapping our component with SidebarProvider to fix the error
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
}
