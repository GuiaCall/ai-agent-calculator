
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Calculator } from "@/components/Calculator";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Documentation } from "@/pages/Documentation";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/layout/PageLoader";
import Pricing from "@/pages/Pricing";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import { GDPRConsentPopup } from "@/components/gdpr/GDPRConsentPopup";
import { CookieConsentBanner } from "@/components/gdpr/CookieConsentBanner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const keepAlive = setInterval(() => {
      const currentUrl = window.location.origin;
      if (currentUrl) {
        fetch(currentUrl)
          .catch(() => {
            console.debug('Keep-alive ping failed, but this is not critical');
          });
      }
    }, 240000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(keepAlive);
    };
  }, []);

  console.log("App loading state:", isLoading);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/" element={<Navigate to="/calculator" replace />} />
          <Route
            path="/calculator"
            element={
              <AuthGuard>
                <Calculator />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/documentation"
            element={
              <AuthGuard>
                <Documentation />
              </AuthGuard>
            }
          />
          <Route
            path="/pricing"
            element={
              <AuthGuard>
                <Pricing />
              </AuthGuard>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="*" element={<Navigate to="/calculator" replace />} />
        </Routes>
        <Toaster />
        <GDPRConsentPopup />
        <CookieConsentBanner />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
