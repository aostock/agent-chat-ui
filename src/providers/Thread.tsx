"use client";

import { validate } from "uuid";
import { Thread } from "@langchain/langgraph-sdk";
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { createClient } from "./client";
import { Settings, DEFAULT_SETTINGS } from "@/components/settings";
import { useLocalStorage } from "react-use";

interface ThreadContextType {
  getThreads: () => Promise<Thread[]>;
  threads: Thread[];
  setThreads: Dispatch<SetStateAction<Thread[]>>;
  threadsLoading: boolean;
  setThreadsLoading: Dispatch<SetStateAction<boolean>>;
  archiveThread: (threadId: string) => Promise<void>;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [storedSettings, setStoredSettings] = useLocalStorage<Settings>(
    "aostock_settings",
    DEFAULT_SETTINGS,
  );

  // Ensure settings is always of type Settings, never undefined
  const settings = storedSettings || DEFAULT_SETTINGS;
  const setSettings = setStoredSettings as React.Dispatch<
    React.SetStateAction<Settings>
  >;

  const getThreads = useCallback(async (): Promise<Thread[]> => {
    if (!settings.serverApiUrl || !settings.assistantId) {
      return [];
    }
    const client = createClient(settings);

    const threads = await client.threads.search({
      metadata: {
        ...getThreadSearchMetadata(settings.assistantId),
      },
      limit: 100,
    });

    return threads;
  }, [settings]);

  const archiveThread = async (threadId: string) => {
    if (!settings.serverApiUrl || !settings.assistantId) return;
    const client = createClient(settings);
    await client.threads.delete(threadId);
    setThreads(threads.filter((t) => t.thread_id !== threadId));
  };

  const value = {
    getThreads,
    threads,
    setThreads,
    threadsLoading,
    setThreadsLoading,
    archiveThread,
    settings,
    setSettings,
  };

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
}
