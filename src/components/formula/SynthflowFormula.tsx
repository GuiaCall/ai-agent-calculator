
export function SynthflowFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Synthflow Plan Cost Calculation</h3>
      <p className="text-gray-600">
        Base Cost = Selected Plan Monthly Price
      </p>
      <p className="text-gray-600">
        If usage exceeds plan minutes:
      </p>
      <ul className="list-disc pl-6 text-gray-600">
        <li>Extra Minutes = Total Minutes - Plan Minutes</li>
        <li>Extra Cost = Extra Minutes × $0.13</li>
        <li>Total Monthly Cost = Base Cost + Extra Cost</li>
      </ul>
      <p className="text-sm text-gray-500 mt-1">
        Additional minutes beyond your plan limit are charged at $0.13 per minute.
      </p>
    </div>
  );
}
