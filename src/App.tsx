import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Calculator } from "@/components/Calculator";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Dashboard from "@/pages/Dashboard";
import Pricing from "@/pages/Pricing";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <AuthLayout mode="login">
                <h1>Welcome back!</h1>
              </AuthLayout>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthLayout mode="signup">
                <h1>Create your account</h1>
              </AuthLayout>
            } 
          />
          <Route path="/" element={<Navigate to="/calculator" replace />} />
          <Route path="/pricing" element={<Pricing />} />
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
          {/* Catch-all route for handling page refreshes */}
          <Route path="*" element={<Navigate to="/calculator" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;