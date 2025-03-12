
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Zap, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuthLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          setIsLoading(false);
          return;
        }
        if (session) {
          navigate("/calculator");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        setIsLoading(false);
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/calculator");
      }
    });
    
    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleResendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      if (error) throw error;
      toast({
        title: "Confirmation email sent",
        description: "Please check your email for the confirmation link"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Login Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 inline-flex rounded-full mb-6">
                  {logoError ? (
                    <div className="w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                      AI
                    </div>
                  ) : (
                    <img 
                      src="/placeholder.svg" 
                      alt="Logo" 
                      className="w-12 h-12" 
                      onError={() => setLogoError(true)} 
                    />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="mt-2 text-gray-600">Sign in to create AI Agent Invoices</p>
              </div>
              
              <Auth 
                supabaseClient={supabase} 
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#4f46e5',
                        brandAccent: '#6366f1'
                      }
                    }
                  },
                  className: {
                    input: "p-3 rounded-lg border border-gray-300 w-full text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                    button: "p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full hover:opacity-90 transition-all font-medium",
                    anchor: "text-indigo-600 hover:text-indigo-800 font-medium",
                    message: "text-sm text-gray-600"
                  }
                }}
                providers={[]} 
                redirectTo={`${window.location.origin}/calculator`}
                onlyThirdPartyProviders={false}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Password'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Right Column - Features Showcase */}
          <div className="order-1 lg:order-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                AI-Powered Invoice Generator
              </h1>
              <p className="text-lg text-gray-700 mb-10">
                Generate professional invoices for your AI agent services in seconds. Customizable, beautiful, and ready to share.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <Zap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Fast Generation</h3>
                    <p className="text-gray-600">Create professional invoices in seconds with our intuitive interface</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Customizable</h3>
                    <p className="text-gray-600">Tailor every invoice to match your brand and client requirements</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">PDF Export</h3>
                    <p className="text-gray-600">Download and share your invoices as professional PDF documents</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
                    <p className="text-gray-600">Your data is always protected with our secure storage system</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Invoice Preview Image */}
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/ca37e38c-d0f7-4e2e-a6bf-61a36559d8b8.png" 
                alt="Invoice Preview" 
                className="w-full h-auto"
              />
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                <h3 className="font-bold text-lg">Professional AI Invoices</h3>
                <p>Impress your clients with detailed, professional invoices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
