
export interface AIProviderModel {
  id: string;
  name: string;
  pricing: {
    input: number;
    output: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  models: AIProviderModel[];
}

export interface LanguageCharCount {
  id: string;
  name: string;
  charsPerMinute: number;
}

export interface OutputType {
  id: string;
  name: string;
  charCount: number;
}

export interface AIServiceSelection {
  language: string;
  provider: string;
  model: string;
  outputType: string;
}
