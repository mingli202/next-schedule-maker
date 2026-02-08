import type { HTMLProps } from "react";
import cn from "@/lib/cn";
import type { Rating } from "@/types/generated";

type Props = {
  rating: Rating | null;
} & HTMLProps<HTMLDivElement>;
export default function TeacherStats({ rating, className }: Props) {
  return (
    <div
      className={cn("group relative flex cursor-default font-bold", className)}
    >
      <p>{!rating || rating.score === 0 ? "N/A" : rating.score}</p>
      <div className="bg-slate absolute top-0 hidden w-48 translate-x-12 -translate-y-1/2 rounded-md p-1 text-sm leading-4 font-normal text-black shadow-lg group-hover:block">
        <p>Rating: {!rating || rating.avg === 0 ? "N/A" : `${rating.avg}/5`}</p>
        <p>
          Difficulty:{" "}
          {!rating || rating.difficulty === 0
            ? "N/A"
            : `${rating.difficulty}/5`}
        </p>
        <p>
          Raters:{" "}
          {!rating || rating.nRating === 0 ? "N/A" : `${rating.nRating} raters`}
        </p>
        <p>
          Take again:{" "}
          {!rating || rating.takeAgain === 0 ? "N/A" : `${rating.takeAgain}%`}
        </p>
        <p className="font-bold">
          Overall Score:{" "}
          {!rating || rating.score === 0 ? "N/A" : `${rating.score}/100`}
        </p>
      </div>
    </div>
  );
}
