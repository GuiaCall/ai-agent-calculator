import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  return (
    <div className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-2xl">
          Invoicer
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard">{t("dashboard")}</Link>
          <Link to="/calculator">{t("calculator")}</Link>
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "light" ? t("darkMode") : t("lightMode")}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate("/account")}>
                {t("accountInformation")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? "Close" : "Menu"}
          </Button>
          {isMenuOpen && (
            <div className="absolute top-full right-0 bg-background border rounded-md shadow-md mt-2 py-2 w-48">
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-secondary">
                {t("dashboard")}
              </Link>
              <Link to="/calculator" className="block px-4 py-2 hover:bg-secondary">
                {t("calculator")}
              </Link>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "light" ? t("darkMode") : t("lightMode")}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    {t("accountInformation")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
