import type { HTMLProps } from "react";
import { cn } from "src/lib/utils";
import type { LecLab } from "src/types/generated";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {
  leclab: LecLab;
} & HTMLProps<HTMLSpanElement>;
export default function TeacherStats({ leclab, className }: Props) {
  const rating = leclab.rating;

  if (!rating || rating.status === "foundn't") {
    return <span className="font-bold">N/A</span>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        <span className={cn("font-bold hover:cursor-pointer", className)}>
          {rating.score === 0 ? "N/A" : rating.score}
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-48 text-sm font-normal shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p>Rating: {rating.avg === 0 ? "N/A" : `${rating.avg}/5`}</p>
        <p>
          Difficulty:{" "}
          {rating.difficulty === 0 ? "N/A" : `${rating.difficulty}/5`}
        </p>
        <p>
          Raters: {rating.nRating === 0 ? "N/A" : `${rating.nRating} raters`}
        </p>
        <p>
          Take again: {rating.takeAgain === 0 ? "N/A" : `${rating.takeAgain}%`}
        </p>
        <p className="font-bold">
          Overall Score: {rating.score === 0 ? "N/A" : `${rating.score}/100`}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
