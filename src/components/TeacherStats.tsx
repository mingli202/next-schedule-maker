import { useQuery } from "@tanstack/react-query";
import type { HTMLProps } from "react";
import { cn } from "src/lib/utils";
import { getRatingsRatingsProfGet, type LecLabResponse } from "@/client";

type Props = {
  leclab: LecLabResponse;
} & HTMLProps<HTMLDivElement>;
export default function TeacherStats({ leclab, className }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["rating", leclab.prof],
    queryFn: async () => {
      if (leclab.rating) {
        return leclab.rating;
      }

      const res = await getRatingsRatingsProfGet({
        path: { prof: leclab.prof },
      });

      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }

      return res.data;
    },
    staleTime: Infinity,
  });

  if (isPending) {
    return null;
  }

  const rating = data;

  if (isError || !rating || rating.status === "foundn't") {
    return <p className="font-bold">N/A</p>;
  }

  return (
    <div
      className={cn("group relative flex cursor-default font-bold", className)}
    >
      <p>{rating.score === 0 ? "N/A" : rating.score}</p>
      <div className="bg-slate absolute top-0 hidden w-48 translate-x-12 -translate-y-1/2 rounded-md p-1 text-sm leading-4 font-normal text-black shadow-lg group-hover:block">
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
      </div>
    </div>
  );
}
