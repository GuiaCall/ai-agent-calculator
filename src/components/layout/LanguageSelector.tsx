
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-8 w-8 rounded-full border-indigo-200 bg-background hover:bg-indigo-50 hover:text-indigo-700 transition-all"
        >
          <Globe className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border border-white bg-gradient-to-r from-indigo-500 to-purple-500"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm ${
              currentLang === lang.code
                ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-medium"
                : "hover:bg-indigo-50"
            }`}
          >
            {currentLang === lang.code && (
              <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
            )}
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
