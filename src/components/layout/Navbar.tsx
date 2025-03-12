
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  LayoutDashboard, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: t("loggedOutSuccessfully"),
        description: t("loggedOutMessage"),
      });
    } catch (error) {
      toast({
        title: t("errorLoggingOut"),
        description: t("errorLoggingOutMessage"),
        variant: "destructive",
      });
    }
  };

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          navigate("/calculator");
          setIsOpen(false);
        }}
        className="flex items-center gap-2 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
      >
        <Calculator className="h-5 w-5" />
        <span className="hidden md:inline">{t("calculator")}</span>
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          navigate("/dashboard");
          setIsOpen(false);
        }}
        className="flex items-center gap-2 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="hidden md:inline">{t("dashboard")}</span>
      </Button>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
      >
        <LogOut className="h-4 w-4" />
        <span>{t("logout")}</span>
      </Button>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg mr-2">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="font-bold text-xl bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t("aiAgentCalculator")}
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSelector />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700">
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-white border-l border-indigo-100">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center gap-2 mb-6 p-2 bg-indigo-50 rounded-lg">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-indigo-800">{t("aiAgentMenu")}</span>
                </div>
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
