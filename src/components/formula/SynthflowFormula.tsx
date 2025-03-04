
export function SynthflowFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Synthflow Plan Cost Calculation</h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          Base Cost = Selected Plan Price (monthly or yearly)
        </p>
        <p className="text-gray-600">
          If usage exceeds plan minutes:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Extra Minutes = Total Minutes - Plan Minutes</li>
          <li>Extra Cost = Extra Minutes × $0.13</li>
          <li>Total Monthly Cost = Base Cost + Extra Cost</li>
        </ul>
        <p className="text-gray-600">
          Monthly Cost = Total Monthly Cost
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Additional minutes beyond your plan limit are charged at $0.13 per minute.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          For yearly plans, the monthly cost is calculated by dividing the yearly price by 12 and adding any overage costs.
        </p>
      </div>
    </div>
  );
}
