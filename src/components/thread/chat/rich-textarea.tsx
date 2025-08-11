import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { assistants, Assistant } from "@/lib/config";
import { AssistantPopover } from "@/components/core/assistant-popover";

interface RichTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onMentionSelect?: (assistant: Assistant) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function RichTextarea({
  value,
  onChange,
  onMentionSelect,
  onKeyDown,
  className,
  ...props
}: RichTextareaProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);

  // Handle input changes and detect @ mentions
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);

    // Check if we're typing after an @ symbol
    if (
      cursorPos > 0 &&
      inputValue[cursorPos - 1] === "@" &&
      !isComposingRef.current
    ) {
      setQuery("");
      setShowSuggestions(true);
    } else if (showSuggestions && cursorPos > 0 && !isComposingRef.current) {
      // Check if we're still in a mention context
      const textBeforeCursor = inputValue.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1) {
        const newQuery = textBeforeCursor.substring(lastAtIndex + 1);
        setQuery(newQuery);
        if (newQuery.length > 0 && !newQuery.includes(" ")) {
          const filtered = assistants.filter(
            (assistant) =>
              assistant.name.toLowerCase().includes(newQuery.toLowerCase()) ||
              assistant.title.toLowerCase().includes(newQuery.toLowerCase()),
          );
          setShowSuggestions(filtered.length > 0);
        } else if (newQuery.length === 0) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Call the custom onKeyDown handler if provided
    if (!showSuggestions) {
      onKeyDown?.(e);
    }

    if (showSuggestions) {
      // Let the popover handle keyboard navigation
      // We only handle escape to close the popover
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
      }
    } else {
      // Handle backspace to delete entire mentions
      if (e.key === "Backspace" && cursorPosition > 0) {
        // Check if we're at the end of a mention (@username pattern)
        const textBeforeCursor = value.substring(0, cursorPosition);
        // Look for pattern: space@username or start@username
        const mentionPattern = /(?:^|\s)@(\w+)$/;
        const match = textBeforeCursor.match(mentionPattern);

        if (match) {
          e.preventDefault();
          const mentionStart = match.index!;
          const mentionEnd = cursorPosition;
          const newValue =
            value.substring(0, mentionStart) + value.substring(mentionEnd);
          onChange(newValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.setSelectionRange(mentionStart, mentionStart);
            }
          }, 0);
        }
      }
    }
  };

  // Handle composition events for IME support
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  // Select an assistant and insert it into the textarea
  const selectAssistant = (assistant: Assistant) => {
    if (!textareaRef.current) return;

    const cursorPos = cursorPosition;
    const textBeforeCursor = value.substring(0, cursorPos);
    const textAfterCursor = value.substring(cursorPos);

    // Find the start of the @ mention
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex === -1) return;

    // Replace the @query with the full mention
    const newText =
      textBeforeCursor.substring(0, lastAtIndex) +
      `@${assistant.name} ` +
      textAfterCursor;

    onChange(newText);

    // Set cursor position after the inserted mention BEFORE closing the popover
    if (textareaRef.current) {
      const newCursorPos = lastAtIndex + assistant.name.length + 2;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }

    // Close the popover after a short delay to ensure focus is set
    setTimeout(() => {
      setShowSuggestions(false);
    }, 10);

    onMentionSelect?.(assistant);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showSuggestions) {
        // The popover component handles click outside detection
        // We just need to close the suggestions state
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  return (
    <div className="relative">
      <AssistantPopover
        onSelect={selectAssistant}
        onClose={() => setShowSuggestions(false)}
        open={showSuggestions}
        query={query}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onFocusCapture={() => {
            // Ensure textarea maintains focus when interacting with popover
            if (showSuggestions && textareaRef.current) {
              setTimeout(() => {
                textareaRef.current?.focus();
              }, 0);
            }
          }}
          className={cn(
            "placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-none border-0 bg-transparent px-3 py-2 text-base shadow-none outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          {...props}
        />
      </AssistantPopover>
    </div>
  );
}
