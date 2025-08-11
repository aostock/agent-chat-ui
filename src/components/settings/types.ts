// Define the settings structure
export interface Settings {
  // General settings
  serverApiUrl: string;
  assistantId: string;
  serverApiKey?: string | undefined;

  // Data settings
  remoteFinancialDataApiUrl: string;
  remoteFinancialDataApiKey: string;

  // Model settings
  intentRecognitionModel: {
    model: string;
    api_key: string;
    api_base?: string;
    [key: string]: any;
  };
  analysisModel: {
    model: string;
    api_key: string;
    api_base?: string;
    [key: string]: any;
  };
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  serverApiUrl: "https://agent.aostock.com",
  assistantId: "agent",
  serverApiKey: "",
  remoteFinancialDataApiUrl: "https://data.aostock.com",
  remoteFinancialDataApiKey: "secret-token",
  intentRecognitionModel: {
    model: "gpt-4o-mini",
    api_key: "",
  },
  analysisModel: {
    model: "gpt-4o",
    api_key: "",
  },
};
