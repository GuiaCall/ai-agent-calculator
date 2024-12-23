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

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
          <Route path="*" element={<Navigate to="/calculator" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;