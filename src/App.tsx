import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Calculator } from "@/components/Calculator";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;