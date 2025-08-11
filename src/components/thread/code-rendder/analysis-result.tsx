import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeAgo } from "@/lib/utils";
import { TickerType, useStreamContext } from "@/providers/Stream";
import { ChevronDownIcon } from "lucide-react";

export const AnalysisResult = (code: string) => {
  let data: { signal: string; confidence: number; reasoning: string } = {
    signal: "",
    confidence: 0,
    reasoning: "",
  };
  try {
    data = JSON.parse(code);
  } catch (e) {
    return <div>...</div>;
  }
  return (
    <Card className="w-[400px]">
      <CardContent className="flex items-center justify-between">
        <CardTitle className="text-center">Analysis Result</CardTitle>
        {/* "bullish" | "bearish" | "neutral" show in different color */}
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            className={
              data.signal === "bullish"
                ? "text-green-500"
                : data.signal === "bearish"
                  ? "text-red-500"
                  : "text-yellow-500"
            }
          >
            {data.signal}
          </Button>
        </CardAction>
      </CardContent>
      <CardContent className="flex items-center justify-between">
        <CardDescription className="text-center">Confidence</CardDescription>
        <CardTitle className="text-2xl font-bold">
          {data.confidence}
          <span className="text-muted-foreground ml-1 text-xs">/100</span>
        </CardTitle>
      </CardContent>
    </Card>
  );
};
