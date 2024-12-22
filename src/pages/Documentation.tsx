import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FormulaExplanation } from "@/components/FormulaExplanation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CalculatorStateProvider } from "@/components/calculator/CalculatorStateContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/components/ui/use-toast";

export function Documentation() {
  const { toast } = useToast();
  
  const handleDownload = async () => {
    try {
      const contentElement = document.getElementById('documentation-content');
      if (!contentElement) return;

      toast({
        title: "Preparing download...",
        description: "Please wait while we generate your PDF.",
      });

      const canvas = await html2canvas(contentElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('ai-agent-calculator-documentation.pdf');

      toast({
        title: "Download complete!",
        description: "Your documentation has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error generating the PDF. Please try again.",
      });
    }
  };

  return (
    <CalculatorStateProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8 mt-20 mb-20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Agent Calculator Documentation</h1>
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download Documentation
          </Button>
        </div>
        
        <div id="documentation-content">
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Application Structure</h2>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Pages and Routing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>/login</strong> - Authentication page for user login/signup</li>
                <li><strong>/calculator</strong> - Main calculator interface</li>
                <li><strong>/dashboard</strong> - User dashboard with analytics</li>
                <li><strong>/documentation</strong> - This documentation page</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Calculator Settings</h2>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Input Parameters</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Average Call Duration</strong> - Duration of each call in minutes</li>
                <li><strong>Total Minutes per Month</strong> - Total minutes of calls per month</li>
                <li><strong>Margin</strong> - Profit margin percentage</li>
                <li><strong>Tax Rate</strong> - Applicable tax rate percentage</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Technology Parameters</h2>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Supported Technologies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Make.com</strong> - Automation platform integration</li>
                <li><strong>Synthflow</strong> - AI voice synthesis service</li>
                <li><strong>Cal.com</strong> - Scheduling platform</li>
                <li><strong>Twilio</strong> - Communication platform</li>
                <li><strong>Vapi</strong> - Voice API service</li>
              </ul>
            </div>
          </Card>

          <ScrollArea className="h-[600px] rounded-md border p-4">
            <FormulaExplanation />
          </ScrollArea>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Data Persistence</h2>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Invoice Storage</h3>
              <p>Invoices are stored in a Supabase database with the following structure:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Invoice number</li>
                <li>Client information</li>
                <li>Agency information</li>
                <li>Total amount</li>
                <li>Tax rate</li>
                <li>Margin</li>
                <li>Date</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Authentication</h2>
            <div className="space-y-2">
              <p>The application uses Supabase authentication with the following features:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email/password authentication</li>
                <li>Protected routes using AuthGuard</li>
                <li>User-specific data isolation</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </CalculatorStateProvider>
  );
}