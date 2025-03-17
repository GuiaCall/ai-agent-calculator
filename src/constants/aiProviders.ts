import { AIProvider, LanguageCharCount, OutputType } from "@/types/aiProviders";

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      {
        id: "gpt4o-mini",
        name: "GPT-4o mini",
        pricing: {
          input: 0.15,
          output: 0.60
        }
      },
      {
        id: "gpt4o",
        name: "GPT-4o",
        pricing: {
          input: 2.50,
          output: 10.00
        }
      },
      {
        id: "gpt45",
        name: "GPT-4.5",
        pricing: {
          input: 75.00,
          output: 150.00
        }
      }
    ]
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      {
        id: "deepseek-standard",
        name: "DeepSeek Standard (UTC 00:30-16:30)",
        pricing: {
          input: 0.27, // Using Cache Miss as default for more accurate estimation
          output: 1.10
        }
      },
      {
        id: "deepseek-discount",
        name: "DeepSeek Discount (UTC 16:30-00:30)",
        pricing: {
          input: 0.135, // Using Cache Miss as default
          output: 0.55
        }
      }
    ]
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

export const OUTPUT_TYPES: OutputType[] = [
  { id: "email", name: "Email", charCount: 2500 },
  { id: "name", name: "Name", charCount: 200 },
  { id: "summary", name: "Summary", charCount: 1500 },
  { id: "data-extraction", name: "Data Extraction", charCount: 900 },
  { id: "content-categorization", name: "Content Categorization", charCount: 400 },
  { id: "keyword-extraction", name: "Keyword Extraction", charCount: 200 },
  { id: "interactive-questions", name: "Interactive Questions / Survey", charCount: 3000 },
  { id: "transcript-summary", name: "Summary of Transcripts", charCount: 1500 },
  { id: "email-generation", name: "Email Generation", charCount: 2500 }
];

export const calculateAICost = (
  language: string,
  provider: string,
  model: string,
  durationMinutes: number,
  totalMinutesPerMonth: number,
  outputType: string = "email" // Default to email if not specified
): number => {
  // Find the selected language
  const selectedLanguage = LANGUAGES.find(lang => lang.id === language);
  
  // Find the selected provider
  const selectedProvider = AI_PROVIDERS.find(prov => prov.id === provider);
  
  // Find the selected output type
  const selectedOutputType = OUTPUT_TYPES.find(type => type.id === outputType);
  
  if (!selectedLanguage || !selectedProvider || !selectedOutputType || durationMinutes <= 0) {
    return 0;
  }
  
  // Find the selected model
  const selectedModel = selectedProvider.models.find(m => m.id === model);
  
  if (!selectedModel) {
    return 0;
  }

  // Calculate total characters from language (input)
  const charsPerMin = selectedLanguage.charsPerMinute;
  const totalInputChars = charsPerMin * durationMinutes;

  // Calculate output characters based on the selected output type
  const outputCharsPerConversation = selectedOutputType.charCount;
  
  // Convert characters to tokens (1 token ≈ 4 characters)
  const inputTokens = totalInputChars / 4;
  const outputTokens = outputCharsPerConversation / 4;

  // Get pricing rates from the selected model
  const inputRate = selectedModel.pricing.input;
  const outputRate = selectedModel.pricing.output;

  // Calculate costs per conversation
  const inputCost = (inputTokens * inputRate) / 1_000_000;
  const outputCost = (outputTokens * outputRate) / 1_000_000;
  const costPerConversation = inputCost + outputCost;

  // Calculate monthly cost based on total minutes per month
  const conversationsPerMonth = totalMinutesPerMonth / durationMinutes;
  const monthlyCost = costPerConversation * conversationsPerMonth;

  return monthlyCost;
};
