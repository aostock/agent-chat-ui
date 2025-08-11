import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ThreadHistory from "./history";
import { useQueryState, parseAsBoolean } from "nuqs";

export function Sidebar() {
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const leftWidth = 260;

  return (
    <div className="relative hidden lg:flex">
      <motion.div
        className="bg-sidebar absolute z-20 h-full overflow-hidden border-r"
        style={{ width: leftWidth }}
        animate={
          isLargeScreen
            ? { x: chatHistoryOpen ? 0 : -leftWidth }
            : { x: chatHistoryOpen ? 0 : -leftWidth }
        }
        initial={{ x: -leftWidth }}
        transition={
          isLargeScreen
            ? { type: "spring", stiffness: leftWidth, damping: 30 }
            : { duration: 0 }
        }
      >
        <div
          className="relative h-full"
          style={{ width: leftWidth }}
        >
          <ThreadHistory />
        </div>
      </motion.div>
    </div>
  );
}