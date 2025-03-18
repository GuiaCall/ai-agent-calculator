
import React from 'react';
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useNavigationItems } from './navigation/useNavigationItems';

export function NavigationSidebar() {
  // We're wrapping our component with SidebarProvider to fix the error
  return (
    <SidebarProvider>
      <div className="hidden md:block">
        <DesktopNavigation />
      </div>
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
}
