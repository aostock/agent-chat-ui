import { useState, useEffect } from "react";
import { useThreads } from "@/providers/Thread";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, AlertCircle } from "lucide-react";
import { ModelConfig } from "./model-config";
import { Settings, DEFAULT_SETTINGS } from "./types";

export function SettingsDialog() {
  const [isOpen, _setIsOpen] = useState(false);
  const { settings, setSettings } = useThreads();
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // after force close, we will not open the dialog auto
  const [forceClose, setForceClose] = useState(false);

  const setIsOpen = (open: boolean) => {
    if (!open) {
      setForceClose(true);
    }
    _setIsOpen(open);
  };

  // Clone settings when dialog opens
  useEffect(() => {
    if (isOpen && settings) {
      setLocalSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [isOpen, settings]);

  // Check for missing required settings and open dialog if needed
  useEffect(() => {
    const hasMissingRequiredSettings = () => {
      if (!settings) return true;
      return (
        !settings.serverApiUrl ||
        !settings.assistantId ||
        !settings.remoteFinancialDataApiUrl ||
        !settings.remoteFinancialDataApiKey ||
        !settings.intentRecognitionModel?.api_key ||
        !settings.analysisModel?.api_key
      );
    };

    if (hasMissingRequiredSettings() && !isOpen && !forceClose) {
      setIsOpen(true);
    }
  }, [settings, isOpen]);

  // Save settings to the central store
  const saveSettings = () => {
    if (localSettings) {
      setSettings(localSettings);
    }
    // Close the dialog
    setIsOpen(false);
  };

  // Validate settings
  const validateSettings = () => {
    const newErrors: Record<string, string> = {};

    if (!localSettings) {
      newErrors.general = "Settings not loaded";
      setErrors(newErrors);
      return false;
    }

    // General settings validation
    if (!localSettings.serverApiUrl) {
      newErrors.serverApiUrl = "Langgraph server API URL is required";
    }
    if (!localSettings.assistantId) {
      newErrors.assistantId = "Assistant ID is required";
    }

    // Data settings validation
    if (!localSettings.remoteFinancialDataApiUrl) {
      newErrors.remoteFinancialDataApiUrl =
        "Remote financial data API URL is required";
    }
    if (!localSettings.remoteFinancialDataApiKey) {
      newErrors.remoteFinancialDataApiKey =
        "Remote financial data API key is required";
    }

    // Model settings validation
    if (!localSettings.intentRecognitionModel?.api_key) {
      newErrors.intentRecognitionModelApiKey =
        "Intent recognition model API key is required";
    }
    if (!localSettings.analysisModel?.api_key) {
      newErrors.analysisModelApiKey = "Analysis model API key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save button click
  const handleSave = () => {
    if (validateSettings()) {
      saveSettings();
      setIsOpen(false);
    }
  };

  // Check if a tab has missing required fields
  const hasMissingFields = (tab: string) => {
    if (!localSettings) return false;

    switch (tab) {
      case "general":
        return !localSettings.serverApiUrl || !localSettings.assistantId;
      case "data":
        return (
          !localSettings.remoteFinancialDataApiUrl ||
          !localSettings.remoteFinancialDataApiKey
        );
      case "model":
        return (
          !localSettings.intentRecognitionModel.api_key ||
          !localSettings.analysisModel.api_key
        );
      default:
        return false;
    }
  };

  // Update local settings handler
  const updateSetting = (key: string, value: any) => {
    setLocalSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-col">
          <Tabs
            defaultValue="general"
            className="w-full flex-grow"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="general"
                className="relative"
              >
                General
                {hasMissingFields("general") && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-3 w-3 p-0"
                  >
                    <AlertCircle className="h-2 w-2" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="relative"
              >
                Data
                {hasMissingFields("data") && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-3 w-3 p-0"
                  >
                    <AlertCircle className="h-2 w-2" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="model"
                className="relative"
              >
                Model
                {hasMissingFields("model") && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-3 w-3 p-0"
                  >
                    <AlertCircle className="h-2 w-2" />
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="general"
              className="mt-4 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="serverApiUrl">Langgraph Server API URL *</Label>
                <Input
                  id="serverApiUrl"
                  value={localSettings?.serverApiUrl || ""}
                  onChange={(e) =>
                    updateSetting("serverApiUrl", e.target.value)
                  }
                  placeholder="http://localhost:2024"
                />
                {errors.serverApiUrl && (
                  <p className="text-sm text-red-500">{errors.serverApiUrl}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assistantId">Assistant ID *</Label>
                <Input
                  id="assistantId"
                  value={localSettings?.assistantId || ""}
                  onChange={(e) => updateSetting("assistantId", e.target.value)}
                  placeholder="agent"
                />
                {errors.assistantId && (
                  <p className="text-sm text-red-500">{errors.assistantId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverApiKey">Langsmith API Key</Label>
                <Input
                  id="serverApiKey"
                  value={localSettings?.serverApiKey || ""}
                  onChange={(e) =>
                    updateSetting("serverApiKey", e.target.value)
                  }
                  placeholder="sk-..."
                />
              </div>
            </TabsContent>

            <TabsContent
              value="data"
              className="mt-4 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="remoteFinancialDataApiUrl">
                  Remote Financial Data API URL *
                </Label>
                <Input
                  id="remoteFinancialDataApiUrl"
                  value={localSettings?.remoteFinancialDataApiUrl || ""}
                  onChange={(e) =>
                    updateSetting("remoteFinancialDataApiUrl", e.target.value)
                  }
                  placeholder="http://127.0.0.1:8000/"
                />
                {errors.remoteFinancialDataApiUrl && (
                  <p className="text-sm text-red-500">
                    {errors.remoteFinancialDataApiUrl}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="remoteFinancialDataApiKey">
                  Remote Financial Data API Key *
                </Label>
                <Input
                  id="remoteFinancialDataApiKey"
                  value={localSettings?.remoteFinancialDataApiKey || ""}
                  onChange={(e) =>
                    updateSetting("remoteFinancialDataApiKey", e.target.value)
                  }
                  placeholder="test"
                />
                {errors.remoteFinancialDataApiKey && (
                  <p className="text-sm text-red-500">
                    {errors.remoteFinancialDataApiKey}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="model"
              className="mt-4 space-y-4"
            >
              <ModelConfig
                title="Intent Recognition Model"
                model={
                  localSettings?.intentRecognitionModel ||
                  DEFAULT_SETTINGS.intentRecognitionModel
                }
                onUpdate={(model) =>
                  updateSetting("intentRecognitionModel", model)
                }
                isRequired={true}
                error={errors.intentRecognitionModelApiKey}
              />

              <div className="border-t pt-4">
                <ModelConfig
                  title="Analysis Model"
                  model={
                    localSettings?.analysisModel ||
                    DEFAULT_SETTINGS.analysisModel
                  }
                  onUpdate={(model) => updateSetting("analysisModel", model)}
                  isRequired={true}
                  error={errors.analysisModelApiKey}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
