import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: t("error"),
        description: t("signOutFailed"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("success"),
        description: t("signOutSuccessful"),
      });
      navigate("/login");
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>{t("signOut")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-64">
            <SheetHeader>
              <SheetTitle>{t("menu")}</SheetTitle>
              <SheetDescription>{t("navigationMenu")}</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link to="/dashboard" className="px-4 py-2 block hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
                {t("dashboard")}
              </Link>
              <Link to="/calculator" className="px-4 py-2 block hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>
                {t("calculator")}
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start px-4 hover:bg-secondary rounded-md" onClick={() => { toggleTheme(); setIsMenuOpen(false); }}>
                {theme === "light" ? t("darkMode") : t("lightMode")}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start px-4 hover:bg-secondary rounded-md" onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}>
                {t("profile")}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start px-4 hover:bg-secondary rounded-md" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                {t("signOut")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
