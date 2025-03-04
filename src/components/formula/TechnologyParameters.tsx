
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
        
        <p className="text-gray-600">
          <span className="font-medium">Synthflow:</span> Base Monthly Cost + Overage Costs
        </p>
        <p className="text-sm text-gray-500">
          Overage Costs = Extra Minutes × $0.13/minute
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Twilio:</span> Monthly Cost for Voice + SMS Services
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Vapi:</span> Fixed Monthly Cost
        </p>
      </div>
    </div>
  );
}
