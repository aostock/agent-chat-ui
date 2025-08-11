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

export const TickerSelect = (code: string) => {
  let data: { list: TickerType[]; selected: TickerType } = {
    list: [],
    selected: {} as TickerType,
  };
  try {
    data = JSON.parse(code);
  } catch (e) {
    console.error(e);
  }
  const { submit, isLoading } = useStreamContext();
  if (data.list.length > 0) {
    return (
      <Card className="mb-2 w-[400px]">
        <CardHeader>
          <CardTitle>{data.selected.symbol}</CardTitle>
          <CardDescription>{data.selected.short_name}</CardDescription>
          <CardAction>{data.selected.exchange}</CardAction>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {data.selected.regular_market_price
              .toFixed(4)
              .replace(/\.?0+$/, "")}
          </CardTitle>
          <CardDescription className="text-center">
            {formatTimeAgo(data.selected.time)}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                Similar Stocks
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="start"
            >
              {data.list.map((item) => (
                <DropdownMenuGroup key={item.symbol}>
                  <DropdownMenuItem
                    className="flex-col items-start"
                    onClick={() =>
                      submit({
                        action: {
                          type: "ticker_switch",
                          parameters: { list: data.list, selected: item },
                        },
                      })
                    }
                  >
                    <div className="flex w-full items-center justify-between">
                      {item.symbol}
                      <DropdownMenuShortcut>
                        {item.exchange}
                      </DropdownMenuShortcut>
                    </div>
                    <p className="text-muted-foreground text-sx">
                      {item.short_name}
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            onClick={() =>
              submit({
                action: {
                  type: "ticker_analysis",
                  parameters: { tickers: [data.selected] },
                },
              })
            }
            disabled={isLoading}
          >
            Start Analysis By
          </Button>
        </CardFooter>
      </Card>
    );
  }
};
