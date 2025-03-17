
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

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface NavigationSidebarProps {
  className?: string;
}

export function NavigationSidebar({ className }: NavigationSidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { technologies } = useCalculatorStateContext();

  // Get active technologies
  const activeTechnologies = technologies.filter(tech => tech.enabled);

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll to the element with smooth behavior
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      
      // Close mobile menu after navigation
      if (window.innerWidth < 768) {
        setIsMobileOpen(false);
      }
    }
  };

  // Scroll to a specific technology section
  const scrollToTechnology = (techId: string) => {
    const element = document.getElementById(`technology-${techId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu after navigation
      if (window.innerWidth < 768) {
        setIsMobileOpen(false);
      }
    }
  };

  return (
    <>
      {/* Mobile menu trigger */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <Button 
          variant="default" 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 animate-pulse"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      >
        <div 
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 transition-transform duration-300 z-40",
            isMobileOpen ? "transform-none" : "translate-y-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="space-y-2">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  className={cn(
                    "flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors",
                    activeSection === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </button>
                
                {/* Technology dropdown for mobile */}
                {item.id === 'technology-section' && activeTechnologies.length > 0 && (
                  <div className="ml-10 space-y-1 animate-fade-in">
                    {activeTechnologies.map(tech => (
                      <button
                        key={tech.id}
                        className="flex items-center w-full px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                        onClick={() => scrollToTechnology(tech.id)}
                      >
                        <Layers className="h-4 w-4 mr-2 text-indigo-500" />
                        <span>{tech.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={cn(
          "hidden md:block fixed left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md z-30 transition-all duration-300",
          isCollapsed ? "w-16" : "w-56",
          className
        )}
      >
        <div className="p-2">
          <div className="flex justify-end">
            <button 
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  className={cn(
                    "flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors animate-fade-in",
                    activeSection === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => scrollToSection(item.id)}
                  title={isCollapsed ? item.title : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </button>

                {/* Technology dropdown for desktop */}
                {!isCollapsed && item.id === 'technology-section' && activeTechnologies.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="ml-8 flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-100 w-full transition-colors animate-fade-in">
                        <Layers className="h-4 w-4 text-indigo-500" />
                        <span className="truncate">{t("technologies")}</span>
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white">
                      {activeTechnologies.map(tech => (
                        <DropdownMenuItem 
                          key={tech.id}
                          className="cursor-pointer"
                          onClick={() => scrollToTechnology(tech.id)}
                        >
                          {tech.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
