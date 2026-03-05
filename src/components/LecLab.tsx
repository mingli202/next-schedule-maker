import { Clock, User } from "lucide-react";
import type { HTMLProps } from "react";
import type { LecLabResponse } from "@/client";
import { capitalize, cn } from "@/lib/utils";
import TeacherStats from "./TeacherStats";

type Props = {
  leclab: LecLabResponse;
} & HTMLProps<HTMLDivElement>;
export default function LecLab({ leclab, className }: Props) {
  return (
    <div className={cn("bg-secondary mt-2 rounded-md p-2", className)}>
      <h4 className="italic">{capitalize(leclab.type ?? "lecture")}</h4>

      <div className="relative flex items-center gap-2">
        <User className="h-4 opacity-50" />
        {leclab.prof}
        <TeacherStats leclab={leclab} />
      </div>

      {leclab.dayTimes.map((dayTime) => {
        return (
          <p className="flex items-center gap-2" key={dayTime.id}>
            <Clock className="h-4 opacity-50" />
            {dayTime.day} {dayTime.startTimeHhmm}-{dayTime.endTimeHhmm}
          </p>
        );
      })}
    </div>
  );
}
