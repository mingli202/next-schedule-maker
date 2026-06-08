import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { cn } from "src/lib/utils";

export function SearchBarInfo() {
  return (
    <Tooltip delayDuration={0}>
      <div className={cn("group relative flex cursor-default font-bold")}>
        <TooltipTrigger asChild>
          <Info className="h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent className="flex w-md flex-col gap-2 p-2 text-sm font-normal shadow-lg">
          <p>
            It will attempt to search for what you meant to search by matching
            various patterns:
          </p>
          <ul className="list-disc pl-4">
            <li>{"r>, r<, r="} matches a rating range.</li>
            <li>{"s>, s<, s="} matches a score range.</li>
            <li>
              M, T, W, R, F or any combinasion of these letters will match days
              off.
            </li>
            <li>
              Any combinasion of NN:MM, NNhMM, NNMM with either a dash or{" "}
              {'"to"'} between matches a time range.
            </li>
            <li>ALL CAPS matches a course name.</li>
            <li>NNN Three numbers matches a code.</li>
            <li>{'"honours" and "blended"'} are special keywords.</li>
            <li>
              Matches a teacher{"'"}s name if the keyword matches at least 67%
              of either their first or last name.
            </li>
            <li>Will look for class titles if none of the above matches.</li>
          </ul>
        </TooltipContent>
      </div>
    </Tooltip>
  );
}
