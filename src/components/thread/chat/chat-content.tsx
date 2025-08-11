import { Message } from "@langchain/langgraph-sdk";
import { DO_NOT_RENDER_ID_PREFIX } from "@/lib/ensure-tool-responses";
import { HumanMessage } from "./messages/human";
import { AssistantMessage, AssistantMessageLoading } from "./messages/ai";

interface ChatContentProps {
  messages: Message[];
  isLoading: boolean;
  firstTokenReceived: boolean;
  stream: any;
  handleRegenerate: (parentCheckpoint: any) => void;
  hasNoAIOrToolMessages: boolean;
}

export function ChatContent({
  messages,
  isLoading,
  firstTokenReceived,
  stream,
  handleRegenerate,
  hasNoAIOrToolMessages,
}: ChatContentProps) {
  const isMessageShow = (message: Message) => {
    const response_metadata = (message as any).response_metadata;
    if (response_metadata && response_metadata.hide) {
      return false;
    }
    return true;
  };

  return (
    <>
      {messages
        .filter(
          (m) =>
            !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX) &&
            isMessageShow(m),
        )
        .map((message, index) =>
          message.type === "human" ? (
            <HumanMessage
              key={message.id || `${message.type}-${index}`}
              message={message}
              isLoading={isLoading}
            />
          ) : (
            <AssistantMessage
              key={message.id || `${message.type}-${index}`}
              message={message}
              isLoading={isLoading}
              handleRegenerate={handleRegenerate}
            />
          ),
        )}
      {/* Special rendering case where there are no AI/tool messages, but there is an interrupt.
        We need to render it outside of the messages list, since there are no messages to render */}
      {hasNoAIOrToolMessages && !!stream.interrupt && (
        <AssistantMessage
          key="interrupt-msg"
          message={undefined}
          isLoading={isLoading}
          handleRegenerate={handleRegenerate}
        />
      )}
      {isLoading && !firstTokenReceived && (
        <AssistantMessageLoading />
      )}
    </>
  );
}