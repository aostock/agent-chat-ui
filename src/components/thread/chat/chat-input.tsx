import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, ArrowUp, Paperclip } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TitleTooltip } from "@/components/core/title-tooltip";
import { ContentBlocksPreview } from "./ContentBlocksPreview";
import { ScrollToBottom } from "@/components/core/stick-to-bottom";
import { cn } from "@/lib/utils";
import { RichTextarea } from "./rich-textarea";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  contentBlocks: any[];
  removeBlock: (idx: number) => void;
  dropRef: React.RefObject<HTMLDivElement | null>;
  dragOver: boolean;
  handlePaste: (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  stream: any;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  contentBlocks,
  removeBlock,
  dropRef,
  dragOver,
  handlePaste,
  handleFileUpload,
  handleSubmit,
  stream,
  isLoading,
}: ChatInputProps) {
  return (
    <div
      ref={dropRef}
      className={cn(
        "bg-muted relative z-10 mx-auto mb-8 w-full max-w-3xl rounded-2xl border shadow-xs transition-all",
        dragOver ? "border-primary border-dotted" : "border-solid",
      )}
    >
      <ScrollToBottom position="inside-input" className="md:hidden" />
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2"
      >
        <ContentBlocksPreview
          blocks={contentBlocks}
          onRemove={removeBlock}
        />
        <RichTextarea
          value={input}
          onChange={setInput}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.metaKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              const el = e.target as HTMLElement | undefined;
              const form = el?.closest("form");
              form?.requestSubmit();
            }
          }}
          placeholder="Type your message to search a ticker ..."
          className="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
        />

        <div className="flex items-center gap-6 p-2 pt-4">
          <Label
            htmlFor="file-input"
            className="hover:bg-background flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
          >
            <TitleTooltip title="Upload image or PDF file">
              <Paperclip className="size-5" />
            </TitleTooltip>
          </Label>

          <input
            id="file-input"
            type="file"
            onChange={handleFileUpload}
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
            className="hidden"
          />
          {stream.isLoading ? (
            <Button
              key="stop"
              onClick={() => stream.stop()}
              className="ml-auto rounded-full"
            >
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              id="chat-submit-btn"
              className="ml-auto w-9 rounded-full shadow-md transition-all"
              disabled={
                isLoading ||
                (!input.trim() && contentBlocks.length === 0)
              }
            >
              <ArrowUp size={32} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}