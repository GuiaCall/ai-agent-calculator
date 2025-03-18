
import React from 'react';
import { Menu, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  activeSection: string | null;
  navItems: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
  }>;
  activeTechnologies: Array<{
    id: string;
    name: string;
  }>;
  scrollToSection: (sectionId: string) => void;
  scrollToTechnology: (techId: string) => void;
}

export function MobileNavigation({
  isMobileOpen,
  setIsMobileOpen,
  activeSection,
  navItems,
  activeTechnologies,
  scrollToSection,
  scrollToTechnology
}: MobileNavigationProps) {
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
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMobileOpen(false);
                  }}
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
                        onClick={() => {
                          scrollToTechnology(tech.id);
                          setIsMobileOpen(false);
                        }}
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
    </>
  );
}
