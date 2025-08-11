import Link from "next/link";
import { Button } from "../ui/button";
import { TitleTooltip } from "./title-tooltip";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-toggle";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  ArrowDown,
  ArrowDownIcon,
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  SquarePen,
  Sun,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AssistantSelect } from "./assistants";
import { Logo } from "./logo";
import { SettingsDialog } from "../settings/settings-dialog";
// import { useArtifactContext, useArtifactOpen } from "../thread/artifact";

export function PageHeader() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  return (
    <div className="relative z-10 flex items-center justify-between gap-3 p-2">
      <div className="relative flex items-center justify-start gap-2">
        <div className="">
          <Button
            className="hover:bg-muted"
            variant="ghost"
            onClick={() => setChatHistoryOpen((p) => !p)}
          >
            {chatHistoryOpen ? (
              <PanelRightOpen className="size-5" />
            ) : (
              <PanelRightClose className="size-5" />
            )}
          </Button>
        </div>
        {!chatHistoryOpen && (
          <div className="ml-2">
            <Logo logoSize={5} textSize="text-lg" />
          </div>
        )}
        <div>{/* <AssistantSelect /> */}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <PageHeaderRight />
        </div>
        <SettingsDialog />
        {/* <TooltipIconButton
          size="lg"
          className="p-4"
          tooltip="New thread"
          variant="ghost"
          onClick={() => setThreadId(null)}
        >
          <SquarePen className="size-5" />
        </TooltipIconButton> */}
      </div>

      <div className="from-background to-background/0 absolute inset-x-0 top-full h-5 bg-gradient-to-b" />
    </div>
  );
}

export function PageHeaderRight() {
  return (
    <div className="flex items-center">
      <div className="mr-2">
        <ThemeToggle />
      </div>
      <TitleTooltip title="Open GitHub repo">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="group relative z-10 border-0 shadow-none"
        >
          <Link
            href="https://github.com/aostock/ai-finance-agents"
            target="_blank"
          >
            <GitHubLogoIcon className="size-4" />
          </Link>
        </Button>
      </TitleTooltip>
    </div>
  );
}
