
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useThemePreference(themeColor: string, isLoading: boolean) {
  useEffect(() => {
    const saveThemePreference = async () => {
      if (isLoading) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_preferences')
        .update({ theme_color: themeColor })
        .eq('user_id', user.id);
    };

    saveThemePreference();
  }, [themeColor, isLoading]);
}
