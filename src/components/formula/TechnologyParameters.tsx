
export function TechnologyParametersFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Technology Parameters Cost Calculation</h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Cal.com:</span> Monthly Plan Cost + Team Members Cost
        </p>
        <p className="text-sm text-gray-500">
          Team Members Cost = Number of Users × $12/month (for Team and Organization plans)
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Make.com:</span> Monthly Plan Cost
        </p>
        <p className="text-sm text-gray-500">
          Based on required operations calculated from total minutes and call duration
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Synthflow:</span> Base Monthly Cost + Overage Costs
        </p>
        <p className="text-sm text-gray-500">
          Overage Costs = Extra Minutes × $0.13/minute (when total minutes exceed plan limits)
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Twilio:</span> Phone Number Cost + Voice Usage
        </p>
        <p className="text-sm text-gray-500">
          Voice Usage = Total Minutes × Selected Rate
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Vapi:</span> Fixed Monthly Cost
        </p>
        <p className="text-sm text-gray-500 mt-3 font-medium">
          All costs in Technology Parameters are monthly costs in your selected currency.
        </p>
      </div>
    </div>
  );
}
