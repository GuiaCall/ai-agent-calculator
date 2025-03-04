
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUniqueCountries, getTypesForCountry, getRateForCountryAndType } from "@/utils/twilioData";
import { TwilioSelection } from "@/types/twilio";
import { TwilioRateDisplay } from "./TwilioRateDisplay";
import { useCalculatorStateContext } from "./calculator/CalculatorStateContext";

interface TwilioCalculatorProps {
  onRateSelect: (selection: TwilioSelection | null) => void;
}

export function TwilioCalculator({ onRateSelect }: TwilioCalculatorProps) {
  const { totalMinutes, setTechnologies, technologies } = useCalculatorStateContext();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = useState<TwilioSelection | null>(null);

  const countries = getUniqueCountries();

  useEffect(() => {
    if (selectedCountry) {
      const types = getTypesForCountry(selectedCountry);
      setAvailableTypes(types);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (currentSelection) {
      const totalCostPerMinute = currentSelection.inboundVoicePrice + (currentSelection.inboundSmsPrice || 0);
      const monthlyCost = (totalMinutes * totalCostPerMinute) + currentSelection.phoneNumberPrice;
      
      // Update the technology parameter with the monthly cost
      setTechnologies(techs => 
        techs.map(tech => 
          tech.id === 'twilio' ? { ...tech, costPerMinute: monthlyCost } : tech
        )
      );
    }
  }, [currentSelection, totalMinutes, setTechnologies]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedType("");
    setCurrentSelection(null);
    onRateSelect(null);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (selectedCountry && type) {
      const rate = getRateForCountryAndType(selectedCountry, type);
      if (rate) {
        const selection = {
          country: selectedCountry,
          type: type,
          phoneNumberPrice: rate.phoneNumberPrice,
          inboundVoicePrice: rate.inboundVoicePrice,
          inboundSmsPrice: rate.inboundSmsPrice
        };
        setCurrentSelection(selection);
        onRateSelect(selection);
        
        // Calculate monthly cost and update technology parameter
        const totalCostPerMinute = selection.inboundVoicePrice + (selection.inboundSmsPrice || 0);
        const monthlyCost = (totalMinutes * totalCostPerMinute) + selection.phoneNumberPrice;
        
        setTechnologies(techs => 
          techs.map(tech => 
            tech.id === 'twilio' ? { ...tech, costPerMinute: monthlyCost } : tech
          )
        );
      }
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Twilio Configuration</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={selectedCountry}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCountry && (
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select
              value={selectedType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a service type" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <TwilioRateDisplay selection={currentSelection} />
      </div>
    </Card>
  );
}
