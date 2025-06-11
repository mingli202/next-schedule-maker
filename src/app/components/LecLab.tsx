import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TeacherStats from "./TeacherStats";
import { faClock, faUser } from "@fortawesome/free-solid-svg-icons";
import { getSectionTimes } from "@/lib/util";
import { Class } from "@/types";
import { HTMLProps } from "react";
import { cn } from "@/lib";

type Props = {
  cl: Class;
  leclab: "lecture" | "laboratory";
} & HTMLProps<HTMLDivElement>;
export default function LecLab({ cl, className, leclab }: Props) {
  return leclab === "lecture" && cl.lecture ? (
    <div className={cn("mt-2 rounded-md bg-secondary p-2", className)}>
      <h4 className="italic">Lecture</h4>

      <div className="relative flex items-center gap-2">
        <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
        {cl.lecture.prof}
        <TeacherStats rating={cl.lecture.rating} />
      </div>

      {getSectionTimes({ ...cl, lab: null }).map((j, index) => {
        return (
          <p className="flex items-center gap-2" key={index}>
            <FontAwesomeIcon icon={faClock} className="h-4 opacity-50" />
            {j[0]} {j[1]}
          </p>
        );
      })}
    </div>
  ) : leclab === "laboratory" && cl.lab ? (
    <div className={cn("mt-2 rounded-md bg-secondary p-2", className)}>
      <h4 className="italic">Lab</h4>

      <div className="relative flex items-center gap-2">
        <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
        {cl.lab.prof}
        <TeacherStats rating={cl.lab.rating} />
      </div>

      {getSectionTimes({ ...cl, lecture: null }).map((j, index) => {
        return (
          <p className="flex items-center gap-2" key={index}>
            <FontAwesomeIcon icon={faClock} className="h-4 opacity-50" />
            {j[0]} {j[1]}
          </p>
        );
      })}
    </div>
  ) : null;
}
