
export interface AIProvider {
  id: string;
  name: string;
  pricing: {
    input: number;
    output: number;
  };
}

export interface LanguageCharCount {
  id: string;
  name: string;
  charsPerMinute: number;
}

export interface AIServiceSelection {
  language: string;
  provider: string;
  outputType: string;
}
