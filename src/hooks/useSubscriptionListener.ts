
import { useEffect } from "react";
import { supabase, subscribeToSubscriptionChanges } from "@/integrations/supabase/client";

export function useSubscriptionListener(callback: () => void) {
  useEffect(() => {
    const setupListener = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Set up subscription to changes
      const subscription = subscribeToSubscriptionChanges(user.id, () => {
        console.log("Subscription change detected, refreshing...");
        callback();
      });
      
      return subscription;
    };

    const subscription = setupListener();
    
    return () => {
      // Clean up subscription on unmount
      subscription.then(sub => {
        if (sub) sub.unsubscribe();
      });
    };
  }, [callback]);
}
