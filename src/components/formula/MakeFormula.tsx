
export function MakeFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Make.com Operations Calculation</h3>
      <p className="text-gray-600">
        Total Calls = Total Minutes ÷ Average Call Duration
      </p>
      <p className="text-gray-600">
        Required Operations = Total Calls × Operations per Scenario × 1.2
      </p>
      <p className="text-gray-600 mt-1">
        Pricing tiers are determined by the total operations required per month:
      </p>
      <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
        <li>10,000 to 8,000,000 operations per month available</li>
        <li>Core: For individuals automating simple work</li>
        <li>Pro: For individuals benefiting from more sophisticated automations</li>
        <li>Teams: For departments introducing automation for multiple users</li>
      </ul>
      <p className="text-sm text-gray-500 mt-1">
        We multiply by 1.2 to add a 20% buffer for incomplete operations that still consume your Make.com quota.
      </p>
      <p className="text-sm text-gray-500">
        Annual billing plans offer significant savings compared to monthly billing (up to 15-20%).
      </p>
      <p className="text-sm text-gray-500 mt-1">
        All operation limits shown are per month. For yearly billing, the price shown is the monthly equivalent for easy comparison, 
        but you'll be billed annually for the full yearly amount.
      </p>
      <p className="text-sm font-medium text-gray-700 mt-2">
        Note: Yearly prices are displayed as monthly equivalents with a "billed yearly" notation.
      </p>
    </div>
  );
}
