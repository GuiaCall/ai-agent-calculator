
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Settings, 
  Server, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Menu
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";

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

  return (
    <>
      {/* Mobile menu trigger */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <Button 
          variant="default" 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
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
              <button
                key={item.id}
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
              <button
                key={item.id}
                className={cn(
                  "flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors",
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
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
