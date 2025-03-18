
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Settings, 
  Server, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useCalculatorStateContext } from './CalculatorStateContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

// Now let's import our new component files
import { MobileNavigation } from './navigation/MobileNavigation';
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { useNavigationItems } from './navigation/useNavigationItems';

export function NavigationSidebar({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { technologies } = useCalculatorStateContext();

  // Get active technologies - fix the property name from 'selected' to 'isSelected'
  const activeTechnologies = technologies.filter(tech => tech.isSelected);
  
  // Use our custom hook to get navigation items
  const { navItems, scrollToSection, scrollToTechnology } = useNavigationItems();

  // Track scroll position to highlight the active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add offset for better UX

      // Find the current section based on scroll position
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        activeSection={activeSection}
        navItems={navItems}
        activeTechnologies={activeTechnologies}
        scrollToSection={scrollToSection}
        scrollToTechnology={scrollToTechnology}
      />

      {/* Desktop Navigation */}
      <DesktopNavigation 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeSection={activeSection}
        navItems={navItems}
        activeTechnologies={activeTechnologies}
        scrollToSection={scrollToSection}
        scrollToTechnology={scrollToTechnology}
        className={className}
      />
    </>
  );
}
