import { ReactNode, useEffect, useRef, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStreamContext } from "@/providers/Stream";
import { useThreads } from "@/providers/Thread";
import { v4 as uuidv4 } from "uuid";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { ArrowDown } from "lucide-react";
import { useQueryState, parseAsBoolean } from "nuqs";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CodeBlock } from "@/components/core";

import { useFileUpload } from "@/hooks/use-file-upload";
import {
  useArtifactOpen,
  ArtifactContent,
  ArtifactTitle,
  useArtifactContext,
} from "../artifact";

import { PageHeader } from "@/components/core/page-header";
import { Logo } from "@/components/core/logo";
import { AssistantList } from "@/components/core/assistants";
import { Suggestions } from "./messages/suggestions";
import {
  StickToBottom,
  StickyToBottomContent,
  ScrollToBottom,
} from "@/components/core/stick-to-bottom";
import { ChatContent } from "./chat-content";
import { ChatInput } from "./chat-input";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Assistant } from "@/lib/config";

export function Chat() {
  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();

  const [threadId, _setThreadId] = useQueryState("threadId");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const [hideToolCalls, setHideToolCalls] = useQueryState(
    "hideToolCalls",
    parseAsBoolean.withDefault(false),
  );
  const { userId } = useThreads();
  const [input, setInput] = useState("");
  const {
    contentBlocks,
    setContentBlocks,
    handleFileUpload,
    dropRef,
    removeBlock,
    dragOver,
    handlePaste,
  } = useFileUpload();
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;
  const messageMetadatas = [];
  for (const message of messages) {
    messageMetadatas.push(stream.getMessagesMetadata(message));
  }
  if (
    messages.length > 0 &&
    stream.isLoading &&
    messages[messages.length - 1].type === "ai"
  ) {
    const lastMessage = messages[messages.length - 1];
    console.log("lastMessage", messages, lastMessage);
  }
  const lastError = useRef<string | undefined>(undefined);

  const setThreadId = (id: string | null) => {
    _setThreadId(id);

    // close artifact and reset artifact context
    closeArtifact();
    setArtifactContext({});
  };

  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error("An error occurred. Please try again.", {
        description: (
          <p>
            <strong>Error:</strong> <CodeBlock>{message}</CodeBlock>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream.error]);

  // TODO: this should be part of the useStream hook
  const prevMessageLength = useRef(0);
  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages?.length &&
      messages[messages.length - 1].type === "ai"
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const sendMessage = (text: string) => {
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        ...(text.trim().length > 0 ? [{ type: "text", text: text }] : []),
        ...contentBlocks,
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    const context =
      Object.keys(artifactContext).length > 0 ? artifactContext : undefined;

    stream.submit(
      { messages: [...toolMessages, newHumanMessage] },
      {
        metadata: {
          user_id: userId,
        },
        streamMode: ["values"],
        optimisticValues: (prev) => ({
          ...prev,
          context,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );
    setContentBlocks([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim().length === 0 && contentBlocks.length === 0) || isLoading)
      return;
    sendMessage(input);
    setInput("");
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    setFirstTokenReceived(false);
    const context =
      Object.keys(artifactContext).length > 0 ? artifactContext : undefined;

    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      metadata: {
        user_id: userId,
      },
      streamMode: ["values"],
      optimisticValues: (prev) => ({
        ...prev,
        context,
      }),
    });
  };

  const chatStarted = !!threadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );

  const leftWidth = 260;

  return (
    <div
      className={cn(
        "grid h-full w-full grid-cols-[1fr_0fr] transition-all duration-500",
        artifactOpen && "grid-cols-[3fr_2fr]",
      )}
    >
      <motion.div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col overflow-hidden",
          !chatStarted && "grid-rows-[1fr]",
        )}
        layout={isLargeScreen}
        transition={
          isLargeScreen
            ? { type: "spring", stiffness: leftWidth, damping: 30 }
            : { duration: 0 }
        }
      >
        <PageHeader />

        <StickToBottom
          className="relative flex-1 overflow-hidden"
          autoScrollOnInit={chatStarted}
        >
          <StickyToBottomContent
            className={cn(
              "absolute inset-0 overflow-x-hidden overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent",
              !chatStarted && "flex flex-col items-stretch pt-[5vh]",
              chatStarted && "grid grid-rows-[1fr_auto]",
            )}
            contentClassName="pt-8 pb-16  max-w-3xl mx-auto flex flex-col gap-4 w-full"
            footer={
              <div className="bg-background/80 sticky bottom-0 flex flex-col items-center gap-6 backdrop-blur-md">
                <ScrollToBottom className="hidden md:block" />
                <Suggestions
                  onSubmit={(text) => {
                    setInput(input + text);
                  }}
                />
                <ChatInput
                  input={input}
                  setInput={setInput}
                  contentBlocks={contentBlocks}
                  removeBlock={removeBlock}
                  dropRef={dropRef}
                  dragOver={dragOver}
                  handlePaste={handlePaste}
                  handleFileUpload={handleFileUpload}
                  handleSubmit={handleSubmit}
                  stream={stream}
                  isLoading={isLoading}
                />
              </div>
            }
          >
            {!chatStarted && (
              <div className="flex flex-col items-center gap-3">
                <Logo
                  logoSize={9}
                  textSize="text-3xl"
                />
                <AssistantList
                  onSelect={(assistant: Assistant) => {
                    setInput(`@${assistant.name} ${input}`);
                  }}
                />
              </div>
            )}
            <ChatContent
              messages={messages}
              isLoading={isLoading}
              firstTokenReceived={firstTokenReceived}
              stream={stream}
              handleRegenerate={handleRegenerate}
              hasNoAIOrToolMessages={hasNoAIOrToolMessages}
            />
          </StickyToBottomContent>
        </StickToBottom>
      </motion.div>
      <div className="relative flex flex-col border-l">
        <div className="absolute inset-0 flex min-w-[30vw] flex-col">
          <div className="grid grid-cols-[1fr_auto] border-b p-4">
            <ArtifactTitle className="truncate overflow-hidden" />
            <button
              onClick={closeArtifact}
              className="cursor-pointer"
            >
              <ArrowDown className="size-5" />
            </button>
          </div>
          <ArtifactContent className="relative flex-grow" />
        </div>
      </div>
    </div>
  );
}
