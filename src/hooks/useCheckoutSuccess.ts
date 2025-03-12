
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useCheckoutSuccess(fetchUserData: (forceRefresh?: boolean) => Promise<void>) {
  const location = useLocation();

  useEffect(() => {
    // This is a simplified version that just fetches user data
    fetchUserData(false);
  }, [location, fetchUserData]);
}
