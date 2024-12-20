import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { LayoutDashboard, Calculator } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white text-lg font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            AI Agent Calculator
          </Link>
          {user && (
            <Link to="/dashboard" className="text-white flex items-center gap-2 hover:text-gray-300">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">{user.email}</span>
              <button
                onClick={logout}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}