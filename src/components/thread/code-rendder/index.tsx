"use client";

import { FC, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { SyntaxHighlighter } from "./syntax-highlighter";

import { TooltipIconButton } from "@/components/thread/tooltip-icon-button";
import { cn } from "@/lib/utils";
import { TickerSelect } from "./ticker-select";
import { AnalysisResult } from "./analysis-result";
import { AnalysisData } from "./analysis-data";
import { CodeBlock } from "@/components/core";

const renderers: Record<string, FC<string>> = {
  TickerSelect,
  AnalysisResult,
  AnalysisData,
};

interface CodeHeaderProps {
  language?: string;
  code: string;
}

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="bg-muted flex items-center justify-between gap-4 rounded-t-lg px-4 py-2 text-sm font-semibold">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <TooltipIconButton
        tooltip="Copy"
        onClick={onCopy}
      >
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

export const CodeRenderer = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const match = /language-(\w+)/.exec(className || "");

  if (match) {
    const language = match[1];
    const code = String(children).replace(/\n$/, "");
    const renderer = renderers[language];
    if (renderer) {
      return renderer(code);
    }
    return (
      <div className="bg-muted/50">
        <CodeHeader
          language={language}
          code={code}
        />
        <SyntaxHighlighter
          language={language}
          className={className}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <CodeBlock className={cn("rounded font-semibold", className)}>
      {String(children)}
    </CodeBlock>
  );
};
