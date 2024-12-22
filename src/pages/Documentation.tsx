import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FormulaExplanation } from "@/components/FormulaExplanation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export function Documentation() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8 mt-20 mb-20">
        <h1 className="text-3xl font-bold">AI Agent Calculator Documentation</h1>
        
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
      <Footer />
    </>
  );
}