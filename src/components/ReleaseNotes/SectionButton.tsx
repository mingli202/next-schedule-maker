import type { ReactNode } from "react";
import { cn } from "src/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export const SectionButton = ({
  sectionId,
  content,
  contentClassName,
  className,
  openDelay,
  closeDelay,
}: {
  sectionId: string;
  content: ReactNode;
  contentClassName?: string;
  className?: string;
  openDelay?: number;
  closeDelay?: number;
}) => {
  return (
    <HoverCard openDelay={openDelay ?? 200} closeDelay={closeDelay ?? 200}>
      <HoverCardTrigger asChild>
        <p
          className={cn(
            "bg-secondary/50 ring-secondary rounded-sm px-2 py-1 ring hover:cursor-pointer",
            className,
          )}
        >
          {sectionId}
        </p>
      </HoverCardTrigger>
      <HoverCardContent
        className="ring-secondary w-sm rounded-xl p-0 ring-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={contentClassName}>{content}</div>
      </HoverCardContent>
    </HoverCard>
  );
};
