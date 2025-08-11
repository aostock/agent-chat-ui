"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { type Message } from "@langchain/langgraph-sdk";
import {
  uiMessageReducer,
  isUIMessage,
  isRemoveUIMessage,
  type UIMessage,
  type RemoveUIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { useQueryState } from "nuqs";
import { useThreads } from "./Thread";
import { toast } from "sonner";
import { Settings } from "@/components/settings";
import { CodeBlock } from "@/components/core";

export type TickerType = {
  symbol: string;
  exchange: string;
  industry_link: string;
  industry_name: string;
  quote_type: string;
  rank: number;
  regular_market_change: number;
  regular_market_percent_change: number;
  regular_market_price: number;
  short_name: string;
  time: string;
};

export type ActionType = {
  type: "ticker_switch" | "ticker_analysis";
  parameters: any;
};

export type StateType = {
  messages: Message[];
  ui?: UIMessage[];
  action?: ActionType;
  suggestions?: string[];
  context?: Record<string, any>;
  settings?: Settings;
};

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: {
      messages?: Message[] | Message | string;
      ui?: (UIMessage | RemoveUIMessage)[] | UIMessage | RemoveUIMessage;
      action?: ActionType;
      ticker?: TickerType;
      suggestions?: string[];
      settings?: Settings;
    };
    CustomEventType: UIMessage | RemoveUIMessage;
  }
>;

type StreamContextType = ReturnType<typeof useTypedStream>;
const StreamContext = createContext<StreamContextType | undefined>(undefined);

async function sleep(ms = 4000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkGraphStatus(
  apiUrl: string,
  apiKey: string | undefined,
): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/info`, {
      ...(apiKey && {
        headers: {
          "X-Api-Key": apiKey,
        },
      }),
    });

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const StreamSession = ({ children }: { children: ReactNode }) => {
  const [threadId, setThreadId] = useQueryState("threadId");
  const { getThreads, setThreads, settings } = useThreads();

  const streamValue = useTypedStream({
    apiUrl: settings.serverApiUrl,
    apiKey: settings.serverApiKey,
    assistantId: settings.assistantId,
    threadId: threadId ?? null,
    defaultHeaders: settings
      ? {
          "x-settings": btoa(JSON.stringify(settings)),
        }
      : {},
    onCustomEvent: (event, options) => {
      console.log("custom_events", event);
      if (isUIMessage(event) || isRemoveUIMessage(event)) {
        options.mutate((prev) => {
          const ui = uiMessageReducer(prev.ui ?? [], event);
          return { ...prev, ui };
        });
      }
    },
    onUpdateEvent: (event) => {
      console.log("update_events", event);
    },
    onThreadId: (id) => {
      setThreadId(id);
      // Refetch threads list when thread ID changes.
      // Wait for some seconds before fetching so we're able to get the new thread that was created.
      sleep().then(() => getThreads().then(setThreads).catch(console.error));
    },
  });

  useEffect(() => {
    if (settings && settings.serverApiUrl) {
      checkGraphStatus(settings.serverApiUrl, settings.serverApiKey).then(
        (ok) => {
          if (!ok) {
            toast.error("Failed to connect to LangGraph server", {
              description: () => (
                <p>
                  Please ensure your graph is running at{" "}
                  <CodeBlock>{settings.serverApiUrl}</CodeBlock> and your API key is
                  correctly set (if connecting to a deployed graph).
                </p>
              ),
              duration: 10000,
              richColors: true,
              closeButton: true,
            });
          }
        },
      );
    }
  }, [settings]);

  return (
    <StreamContext.Provider value={streamValue}>
      {children}
    </StreamContext.Provider>
  );
};

export const StreamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <StreamSession>{children}</StreamSession>;
};

// Create a custom hook to use the context
export const useStreamContext = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStreamContext must be used within a StreamProvider");
  }
  return context;
};

export default StreamContext;
