import { Clock, User } from "lucide-react";
import type { HTMLProps } from "react";
import type { LecLab } from "src/types/generated";
import { capitalize, cn } from "@/lib/utils";
import TeacherStats from "./TeacherStats";

type Props = {
  leclab: LecLab;
} & HTMLProps<HTMLDivElement>;
export default function LecLabComponent({ leclab, className }: Props) {
  return (
    <div className={cn("bg-secondary rounded-md p-2", className)}>
      <h4 className="italic">{capitalize(leclab.type ?? "lecture")}</h4>

      <div className="relative flex items-center gap-2">
        <User className="h-4 opacity-50" />
        {leclab.prof}
        <TeacherStats leclab={leclab} />
      </div>

      {leclab.dayTimes.map((dayTime) => {
        return (
          <p
            className="flex items-center gap-2"
            key={
              dayTime.day +
              dayTime.startTimeHhmm +
              dayTime.endTimeHhmm +
              leclab.title
            }
          >
            <Clock className="h-4 opacity-50" />
            {dayTime.day} {dayTime.startTimeHhmm}-{dayTime.endTimeHhmm}
          </p>
        );
      })}
    </div>
  );
}
