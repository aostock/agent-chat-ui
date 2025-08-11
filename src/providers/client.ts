import { Settings } from "@/components/settings";
import { Client } from "@langchain/langgraph-sdk";

export function createClient(settings: Settings) {
  const base64 = btoa(JSON.stringify(settings));
  return new Client({
    apiKey: settings.serverApiKey,
    apiUrl: settings.serverApiUrl,
    defaultHeaders: {
      "x-settings": base64,
    },
  });
}
