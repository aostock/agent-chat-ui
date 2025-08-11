import { Button } from "@/components/ui/button";
import { useStreamContext } from "@/providers/Stream";

export const Suggestions = ({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) => {
  const stream = useStreamContext();
  const values = stream.values;
  let suggestions = [];
  if (values.suggestions) {
    suggestions = values.suggestions;
  } else {
    suggestions = ["Query Apple Inc.", "Analyze Apple Inc."];
  }
  return (
    <div className="flex max-w-3xl flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <Button
          size="sm"
          disabled={stream.isLoading}
          variant="secondary"
          className="text-primary/75 rounded-full border text-xs"
          key={index}
          onClick={() => {
            onSubmit(suggestion);
          }}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};
