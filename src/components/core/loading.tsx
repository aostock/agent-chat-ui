import { cn } from "@/lib/utils";

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  );
}
