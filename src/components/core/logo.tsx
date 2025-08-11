import { cn } from "@/lib/utils";

export function Logo({ logoSize = 7, textSize = "text-xl" }) {
  return (
    <div className="flex items-center">
      <div className="">
        <img
          src="/logo.svg"
          alt="logo"
          className={cn(`h-${logoSize} w-${logoSize}`)}
        />
      </div>
      <div className={cn("ml-2 font-bold", textSize)}>AOSTOCK</div>
    </div>
  );
}
