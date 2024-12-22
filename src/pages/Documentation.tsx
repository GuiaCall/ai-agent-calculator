import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormulaExplanation } from "@/components/FormulaExplanation";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Documentation() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20 mb-20">
        <h1 className="text-3xl font-bold mb-8">AI Agent Calculator Documentation</h1>
        
        <div className="grid gap-8">
          {/* Application Structure */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Application Structure</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Routes</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><code>/calculator</code> - Main calculator interface</li>
                  <li><code>/dashboard</code> - User dashboard with analytics</li>
                  <li><code>/login</code> - Authentication page</li>
                  <li><code>/documentation</code> - This documentation page</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Key Components</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Calculator - Main calculation interface</li>
                  <li>CalculatorSettings - Configuration for calculations</li>
                  <li>TechnologyParameters - Technology selection and costs</li>
                  <li>InvoiceHistory - Past invoice management</li>
                  <li>CalculatorPreview - Invoice preview</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Calculator Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Calculator Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Input Parameters</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Average Call Duration (minutes)</li>
                  <li>Total Minutes per Month</li>
                  <li>Margin (%)</li>
                  <li>Tax Rate (%)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Technology Parameters */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Technology Parameters</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Available Technologies</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Make.com - Automation platform</li>
                  <li>Synthflow - Voice synthesis</li>
                  <li>Cal.com - Scheduling platform</li>
                  <li>Twilio - Communication platform</li>
                  <li>Vapi - Voice API</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Formulas */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Calculation Formulas</h2>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <FormulaExplanation />
            </ScrollArea>
          </Card>

          {/* Data Persistence */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Data Persistence</h2>
            <div className="space-y-4">
              <p>All data is stored in a Supabase database with the following structure:</p>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Invoices Table</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Invoice number</li>
                  <li>Client information</li>
                  <li>Agency information</li>
                  <li>Total amount</li>
                  <li>Tax rate</li>
                  <li>Margin</li>
                  <li>Total minutes</li>
                  <li>Call duration</li>
                  <li>Creation date</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Authentication */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <div className="space-y-4">
              <p>The application uses Supabase Authentication with:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Email/Password authentication</li>
                <li>Protected routes using AuthGuard</li>
                <li>User-specific data access through Row Level Security</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}