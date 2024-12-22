import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Calculator } from "@/components/Calculator";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Documentation } from "@/pages/Documentation";

const queryClient = new QueryClient();

function App() {
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
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;