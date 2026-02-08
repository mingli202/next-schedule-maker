import { Clock, User } from "lucide-react";
import type { HTMLProps } from "react";
import cn from "@/lib/cn";
import { capitalize, getSectionTimes } from "@/lib/util";
import type { Section } from "@/types/generated";
import TeacherStats from "./TeacherStats";

type Props = {
  section: Section;
} & HTMLProps<HTMLDivElement>;
export default function LecLab({ section, className }: Props) {
  return section.times.map((time, i) => (
    <div
      className={cn("bg-secondary mt-2 rounded-md p-2", className)}
      key={section.id + time.title + i.toString()}
    >
      <h4 className="italic">{capitalize(time.type ?? "lecture")}</h4>

      <div className="relative flex items-center gap-2">
        <User className="h-4 opacity-50" />
        {time.prof}
        <TeacherStats teacher={time.prof} />
      </div>

      {getSectionTimes(time.time).map(([d, t], index) => {
        return (
          <p className="flex items-center gap-2" key={d + t + index.toString()}>
            <Clock className="h-4 opacity-50" />
            {d} {t}
          </p>
        );
      })}
    </div>
  ));
}
