import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Settings } from "./types";

interface ModelConfigProps {
  model: Settings["intentRecognitionModel"];
  onUpdate: (model: Settings["intentRecognitionModel"]) => void;
  title: string;
  isRequired?: boolean;
  error?: string;
}

const LITELLM_PROVIDERS = [
  "openai",
  "azure",
  "anthropic",
  "google",
  "aws",
  "deepseek",
  "cohere",
  "huggingface",
  "ollama",
  "together_ai",
  "anyscale",
  "replicate",
  "deepinfra",
  "petals",
  "fireworks",
  "perplexity",
  "groq",
  "nvidia",
  "ai21",
  "aleph_alpha",
  "mistral",
  "voyage",
  "xinference",
  "cloudflare",
  "databricks",
  "vertex_ai",
  "palm",
  "bedrock",
  "sagemaker",
  "watsonx",
  "triton",
  "predibase",
  "singlestore",
  "ray",
  "custom_openai",
  "custom",
];

export function ModelConfig({
  model,
  onUpdate,
  title,
  isRequired = false,
  error,
}: ModelConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedConfig, setAdvancedConfig] = useState<string>(
    model && Object.keys(model).length > 3
      ? JSON.stringify(
          Object.fromEntries(
            Object.entries(model).filter(
              ([key]) => !["model", "api_key", "api_base"].includes(key),
            ),
          ),
          null,
          2,
        )
      : "{}",
  );

  const handleProviderChange = (provider: string) => {
    // Extract model name from current model string if it contains a slash
    const modelName = model.model.includes("/")
      ? model.model.split("/")[1]
      : model.model;
    const newModelString =
      provider === "openai" ? modelName : `${provider}/${modelName}`;

    onUpdate({
      ...model,
      model: newModelString,
    });
  };

  const handleModelNameChange = (modelName: string) => {
    // Get current provider from model string
    const currentModel = model.model;
    const provider = currentModel.includes("/")
      ? currentModel.split("/")[0]
      : "openai";
    const newModelString =
      provider === "openai" ? modelName : `${provider}/${modelName}`;

    onUpdate({
      ...model,
      model: newModelString,
    });
  };

  const handleAdvancedConfigChange = (configStr: string) => {
    setAdvancedConfig(configStr);
    try {
      const parsed = JSON.parse(configStr);
      onUpdate({
        ...model,
        ...parsed,
      });
    } catch (e) {
      // Invalid JSON, do nothing
    }
  };

  // Extract provider and model name from the model string
  const getProviderAndModel = () => {
    const modelStr = model.model;
    if (modelStr.includes("/")) {
      const [provider, modelName] = modelStr.split("/");
      return { provider, modelName };
    }
    return { provider: "openai", modelName: modelStr };
  };

  const { provider, modelName } = getProviderAndModel();

  return (
    <Collapsible className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium">
          {title}
          {isRequired && " *"}
        </h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 p-0"
          >
            {showAdvanced ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      {/* Collapsed view - just show the model name */}
      {!showAdvanced && (
        <div className="text-muted-foreground ml-2 text-sm">
          {model.model || "No model configured"}
        </div>
      )}

      <CollapsibleContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-provider`}>Model Provider</Label>
          <select
            id={`${title}-provider`}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value)}
          >
            {LITELLM_PROVIDERS.map((providerOption) => (
              <option
                key={providerOption}
                value={providerOption}
              >
                {providerOption}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${title}-model`}>Model Name</Label>
          <Input
            id={`${title}-model`}
            value={modelName}
            onChange={(e) => handleModelNameChange(e.target.value)}
            placeholder="gpt-4o-mini"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${title}-api_key`}>
            API Key {isRequired && "*"}
          </Label>
          <Input
            id={`${title}-api_key`}
            type="password"
            value={model.api_key}
            onChange={(e) => onUpdate({ ...model, api_key: e.target.value })}
            placeholder="sk-..."
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${title}-api_base`}>API Base URL</Label>
          <Input
            id={`${title}-api_base`}
            value={model.api_base || ""}
            onChange={(e) => onUpdate({ ...model, api_base: e.target.value })}
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`${title}-show-advanced`}
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
          />
          <Label htmlFor={`${title}-show-advanced`}>
            Advanced Configuration
          </Label>
        </div>

        {showAdvanced && (
          <div className="space-y-2">
            <Label htmlFor={`${title}-advanced`}>
              Advanced Configuration (JSON)
            </Label>
            <Textarea
              id={`${title}-advanced`}
              value={advancedConfig}
              onChange={(e) => handleAdvancedConfigChange(e.target.value)}
              placeholder='{"temperature": 0.7, "max_tokens": 1000}'
              rows={4}
            />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
