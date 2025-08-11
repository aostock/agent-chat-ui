import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useQueryState, parseAsBoolean } from "nuqs";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Chat } from "./chat/index";

export function Thread() {
  const [chatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const leftWidth = 260;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <motion.div
        className="w-full"
        animate={{
          marginLeft: chatHistoryOpen ? (isLargeScreen ? leftWidth : 0) : 0,
          width: chatHistoryOpen
            ? isLargeScreen
              ? "calc(100% - " + leftWidth + "px)"
              : "100%"
            : "100%",
        }}
        transition={
          isLargeScreen
            ? { type: "spring", stiffness: leftWidth, damping: 30 }
            : { duration: 0 }
        }
      >
        <Chat />
      </motion.div>
    </div>
  );
}