
export function VapiFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Vapi Cost Calculation</h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          Monthly Cost = Cost Per Minute × Total Minutes
        </p>
        <p className="text-sm text-gray-500 mt-1">
          The cost per minute is set by the user, and the total minutes are taken from the calculator settings.
        </p>
      </div>
    </div>
  );
}
