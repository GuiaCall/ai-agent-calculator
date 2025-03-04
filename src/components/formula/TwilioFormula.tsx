
import { Phone } from "lucide-react";

export function TwilioFormula() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Phone className="h-5 w-5 text-indigo-600" />
        </div>
        Twilio Cost Calculation
      </h3>
      <p className="text-gray-600">
        Base Cost = Selected Rate × Total Minutes
      </p>
      <p className="text-sm text-gray-500 mt-1">
        The rate is determined by the selected country and number type. Different rates apply for local, mobile, and toll-free numbers.
      </p>
    </div>
  );
}
