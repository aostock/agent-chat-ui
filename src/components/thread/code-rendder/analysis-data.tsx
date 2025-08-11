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

export const AnalysisData = (code: string) => {
  let data: {
    title: string;
    score: number;
    max_score: number;
    details: [];
  } = {
    title: "",
    score: 0,
    max_score: 0,
    details: [],
  };
  try {
    data = JSON.parse(code);
  } catch (e) {
    return <div>...</div>;
  }

  const get_details = () => {
    if (data.details && data.details instanceof Array) {
      return data.details;
    }
    console.error("no details", data);
    return [];
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.score >= 0 && (
          <CardAction className="text-2xl">
            {data.score}
            <span className="text-muted-foreground ml-1 text-xs">
              /{data.max_score}
            </span>
          </CardAction>
        )}
      </CardHeader>
      {/* {get_data_items().map((item) => (
        <CardContent
          className="flex justify-between items-center"
          key={item.key}
        >
          <span>{item.key}</span>
          <span>{item.value}</span>
        </CardContent>
      ))} */}
      <CardContent className="flex items-center justify-between">
        <CardDescription className="text-wrap">
          <ul className="ml-3 list-disc">
            {get_details().map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
