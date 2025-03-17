
import { AIProvider, LanguageCharCount } from "@/types/aiProviders";

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    pricing: {
      input: 0.000075,
      output: 0.000075
    }
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    pricing: {
      input: 0.00014,
      output: 0.00027
    }
  }
];

export const LANGUAGES: LanguageCharCount[] = [
  {
    id: "english",
    name: "English",
    charsPerMinute: 1140 // Approximately 228 words * 5 characters per word
  },
  {
    id: "french",
    name: "French",
    charsPerMinute: 995 // Approximately 195 words * 5.1 characters per word
  },
  {
    id: "german",
    name: "German",
    charsPerMinute: 931 // Approximately 179 words * 5.2 characters per word
  }
];

export const OUTPUT_TYPES = [
  { id: "email", name: "Email" },
  { id: "name", name: "Name" },
  { id: "summary", name: "Summary" }
];

export const calculateAICost = (
  language: string,
  provider: string,
  durationMinutes: number,
  totalMinutesPerMonth: number
): number => {
  // Find the selected language and provider
  const selectedLanguage = LANGUAGES.find(lang => lang.id === language);
  const selectedProvider = AI_PROVIDERS.find(prov => prov.id === provider);

  if (!selectedLanguage || !selectedProvider || durationMinutes <= 0) {
    return 0;
  }

  // Calculate total characters
  const charsPerMin = selectedLanguage.charsPerMinute;
  const totalChars = charsPerMin * durationMinutes;

  // Convert characters to tokens (1 token ≈ 4 characters)
  const totalTokens = totalChars / 4;

  // Get pricing rates
  const inputRate = selectedProvider.pricing.input;
  const outputRate = selectedProvider.pricing.output;

  // Calculate costs per conversation
  const inputCost = (totalTokens * inputRate) / 1_000_000;
  const outputCost = (totalTokens * outputRate) / 1_000_000;
  const costPerConversation = inputCost + outputCost;

  // Calculate monthly cost based on total minutes per month
  const conversationsPerMonth = totalMinutesPerMonth / durationMinutes;
  const monthlyCost = costPerConversation * conversationsPerMonth;

  return monthlyCost;
};
