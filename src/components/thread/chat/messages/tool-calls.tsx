import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Settings2Icon } from "lucide-react";
import { CodeBlock } from "@/components/core";

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

function ContentItem({ content }: { content: any }) {
  const complexValue = isComplexValue(content);
  const contentStr = complexValue
    ? JSON.stringify(content, null, 2)
    : String(content);
  if (complexValue) {
    return (
      <CodeBlock className="rounded px-2 py-1 font-mono text-sm break-all">
        {contentStr}
      </CodeBlock>
    );
  }
  return (
    <CodeBlock className="rounded px-2 py-1 font-mono text-sm break-all">
      {contentStr}
    </CodeBlock>
  );
}

function ToolItem({ tc }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex justify-between border-b px-4 py-2">
        <h3 className="font-medium">
          <Settings2Icon className="mr-2 inline-block h-4 w-4" />
          {tc.name}
          {/* {tc.id && (
                  <code className="px-2 py-1 ml-2 text-sm rounded">
                    {tc.id}
                  </code>
                )} */}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-muted rounded p-1"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ContentItem content={tc.args} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ToolCalls({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="w-full">
      {toolCalls.map((tc, idx) => {
        return (
          <ToolItem
            key={idx}
            tc={tc}
          />
        );
      })}
    </div>
  );
}

export function ToolResult({ message }: { message: ToolMessage }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border">
        <div className="flex justify-between border-b px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            {message.name ? (
              <h3 className="font-medium">
                <Settings2Icon className="mr-2 inline-block h-4 w-4" />
                Tool Result:{" "}
                <span className="rounded px-2 py-1">{message.name}</span>
              </h3>
            ) : (
              <h3 className="font-medium">Tool Result</h3>
            )}
            {/* {message.tool_call_id && (
              <code className="px-2 py-1 text-sm rounded">
                {message.tool_call_id}
              </code>
            )} */}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-muted rounded p-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3">
                <ContentItem content={message.content} />
                {/* {isJsonContent ? (
                  <table className="min-w-full divide-y">
                    <tbody className="divide-y">
                      {(Array.isArray(parsedContent)
                        ? parsedContent
                        : Object.entries(parsedContent)
                      ).map((item, argIdx) => {
                        const [key, value] = Array.isArray(parsedContent)
                          ? [argIdx, item]
                          : [item[0], item[1]];
                        return (
                          <tr key={argIdx}>
                            <td className="px-4 py-2 text-sm font-medium whitespace-nowrap">
                              {key}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {isComplexValue(value) ? (
                                <code className="px-2 py-1 font-mono text-sm break-all rounded b">
                                  {JSON.stringify(value, null, 2)}
                                </code>
                              ) : (
                                String(value)
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <code className="block text-sm break-all">{contentStr}</code>
                )} */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
