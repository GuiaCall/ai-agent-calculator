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
    // Initial loading timer
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Keep-alive functionality
    const keepAlive = setInterval(() => {
      const currentUrl = window.location.origin; // Use origin instead of href
      if (currentUrl) {
        fetch(currentUrl)
          .catch(() => {
            // Silent catch - just to prevent console errors
            console.debug('Keep-alive ping failed, but this is not critical');
          });
      }
    }, 240000); // 4 minutes

    // Cleanup both timers
    return () => {
      clearTimeout(loadingTimer);
      clearInterval(keepAlive);
    };
  }, []);

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
          <Route path="*" element={<Navigate to="/calculator" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;