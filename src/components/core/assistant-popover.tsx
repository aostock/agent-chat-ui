import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { assistants, Assistant } from "@/lib/config";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AssistantPopoverProps {
  onSelect: (assistant: Assistant) => void;
  onClose: () => void;
  query: string;
  open: boolean;
  children: React.ReactNode;
}

export function AssistantPopover({
  onSelect,
  onClose,
  query,
  open,
  children,
}: AssistantPopoverProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Filter assistants based on query
  const filteredAssistants = React.useMemo(() => {
    if (!query) return assistants;
    return assistants.filter(
      (assistant) =>
        assistant.name.toLowerCase().includes(query.toLowerCase()) ||
        assistant.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const handleSelect = useCallback(
    (assistant: Assistant) => {
      if (filteredAssistants.length === 0 || !assistant) return;
      onSelect(assistant);
      onClose();
    },
    [onSelect, onClose, filteredAssistants],
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredAssistants.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredAssistants.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredAssistants.length) % filteredAssistants.length,
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        handleSelect(filteredAssistants[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredAssistants, selectedIndex, handleSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align="start"
        className="max-h-120 w-full max-w-md overflow-y-auto rounded-md border p-0 shadow-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={onClose}
      >
        <div className="p-1">
          {filteredAssistants.map((assistant, index) => (
            <AssistantSuggestionItem
              key={assistant.name}
              assistant={assistant}
              isSelected={index === selectedIndex}
              ref={index === selectedIndex ? selectedRef : null}
              onClick={() => handleSelect(assistant)}
            />
          ))}
          {filteredAssistants.length === 0 && (
            <div className="text-muted-foreground py-2 text-center">
              No assistants found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface AssistantSuggestionItemProps {
  assistant: Assistant;
  isSelected: boolean;
  onClick: () => void;
}

const AssistantSuggestionItem = React.forwardRef<
  HTMLDivElement,
  AssistantSuggestionItemProps
>(({ assistant, isSelected, onClick }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer items-start gap-2 rounded-sm px-2 py-2 text-sm",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <img
        className="mr-2 h-8 w-8 rounded-full"
        src={`/images/assistants/${assistant.name}.png`}
        onError={(e) => {
          // Fallback to a default image if the assistant image doesn't exist
          const target = e.target as HTMLImageElement;
          target.src = "/images/assistants/agent.png";
        }}
      />
      <div>
        <div className="font-medium">
          {assistant.title}
          <span className="text-muted-foreground my-1 ml-2 text-xs">
            @{assistant.name}
          </span>
        </div>
        <div className="text-muted-foreground my-1 text-xs">
          {assistant.description}
        </div>
      </div>
    </div>
  );
});

AssistantSuggestionItem.displayName = "AssistantSuggestionItem";
