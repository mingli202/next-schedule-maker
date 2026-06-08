import type { HTMLProps } from "react";
import { cn } from "src/lib/utils";
import type { LecLab } from "src/types/generated";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  leclab: LecLab;
} & HTMLProps<HTMLDivElement>;
export default function TeacherStats({ leclab, className }: Props) {
  const rating = leclab.rating;

  if (!rating || rating.status === "foundn't") {
    return <p className="font-bold">N/A</p>;
  }

  return (
    <Tooltip delayDuration={0}>
      <div
        className={cn(
          "group relative flex cursor-default font-bold",
          className,
        )}
      >
        <TooltipTrigger asChild>
          <p>{rating.score === 0 ? "N/A" : rating.score}</p>
        </TooltipTrigger>
        <TooltipContent className="w-48 text-sm font-normal shadow-lg">
          <p>Rating: {rating.avg === 0 ? "N/A" : `${rating.avg}/5`}</p>
          <p>
            Difficulty:{" "}
            {rating.difficulty === 0 ? "N/A" : `${rating.difficulty}/5`}
          </p>
          <p>
            Raters: {rating.nRating === 0 ? "N/A" : `${rating.nRating} raters`}
          </p>
          <p>
            Take again:{" "}
            {rating.takeAgain === 0 ? "N/A" : `${rating.takeAgain}%`}
          </p>
          <p className="font-bold">
            Overall Score: {rating.score === 0 ? "N/A" : `${rating.score}/100`}
          </p>
        </TooltipContent>
      </div>
    </Tooltip>
  );
}
