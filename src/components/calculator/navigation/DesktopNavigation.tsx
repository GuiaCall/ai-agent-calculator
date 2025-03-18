
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';

interface DesktopNavigationProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
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
  className?: string;
}

export function DesktopNavigation({
  isCollapsed,
  setIsCollapsed,
  activeSection,
  navItems,
  activeTechnologies,
  scrollToSection,
  scrollToTechnology,
  className
}: DesktopNavigationProps) {
  const { t } = useTranslation();

  return (
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
  );
}
