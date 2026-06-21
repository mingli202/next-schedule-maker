import { Clock, User } from "lucide-react";
import { Iter } from "src/lib/iter";
import { capitalize, cn } from "src/lib/utils";
import type { DayTime, LecLab } from "src/types/generated";
import LecLabComponent from "../LecLab";
import TeacherStats from "../TeacherStats";
import { greenText, redText } from "./colors";

export function LeclabsDiff({
  sectionId,
  oldLeclabs,
  newLecLabs,
}: {
  sectionId: string;
  oldLeclabs: LecLab[];
  newLecLabs: LecLab[];
}) {
  const minLen = Math.min(oldLeclabs.length, newLecLabs.length);

  return (
    <>
      {Iter.from(oldLeclabs)
        .zip(Iter.from(newLecLabs))
        .map(([oldLeclab, newLeclab], i) => (
          <LecLabDiff
            key={`${sectionId}-leclabdiff-${JSON.stringify(oldLeclab.dayTimes)}-${JSON.stringify(newLeclab.dayTimes)}-${i.toString()}`}
            oldLeclab={oldLeclab}
            newLeclab={newLeclab}
          />
        ))}
      {Iter.from(oldLeclabs)
        .skip(minLen)
        .map((leclab, i) => (
          <LecLabComponent
            key={`${sectionId}-extraoldleclab-${JSON.stringify(leclab.dayTimes)}-${i.toString()}`}
            leclab={leclab}
            className={cn(redText, "bg-red-900")}
          />
        ))}
      {Iter.from(newLecLabs)
        .skip(minLen)
        .map((leclab, i) => (
          <LecLabComponent
            key={`${sectionId}-extranewleclab-${JSON.stringify(leclab.dayTimes)}-${i.toString()}`}
            leclab={leclab}
            className={cn(greenText, "bg-green-900")}
          />
        ))}
    </>
  );
}

export function LecLabDiff({
  oldLeclab,
  newLeclab,
}: {
  oldLeclab: LecLab;
  newLeclab: LecLab;
}) {
  const oldLeclabType = capitalize(oldLeclab.type ?? "lecture");
  const newLeclabType = capitalize(newLeclab.type ?? "lecture");

  return (
    <div className={cn("bg-secondary rounded-md p-2")}>
      <h4 className="italic">
        {oldLeclabType === newLeclabType ? (
          oldLeclabType
        ) : (
          <Diff oldStr={oldLeclabType} newStr={newLeclabType} />
        )}
      </h4>

      <div className="relative flex items-center gap-2">
        <User className="h-4 opacity-50" />
        {oldLeclab.prof === newLeclab.prof ? (
          <>
            {oldLeclab.prof}
            <TeacherStats leclab={oldLeclab} />
          </>
        ) : (
          <div className="flex w-full flex-col">
            <div className={cn("flex gap-1", redText)}>
              {oldLeclab.prof}
              <TeacherStats leclab={oldLeclab} />
            </div>
            <div className={cn("flex gap-1", greenText)}>
              {newLeclab.prof}
              <TeacherStats leclab={newLeclab} />
            </div>
          </div>
        )}
      </div>

      <DaytimesDiff
        title={oldLeclab.title}
        oldDaytimes={oldLeclab.dayTimes}
        newDaytimes={newLeclab.dayTimes}
      />
    </div>
  );
}

export function DaytimesDiff({
  title,
  oldDaytimes,
  newDaytimes,
}: {
  title: string;
  oldDaytimes: DayTime[];
  newDaytimes: DayTime[];
}) {
  const minLen = Math.min(oldDaytimes.length, newDaytimes.length);

  return (
    <>
      {Iter.from(oldDaytimes)
        .zip(Iter.from(newDaytimes))
        .map(([oldDaytime, newDaytime]) => (
          <div
            className="flex items-center gap-2"
            key={
              oldDaytime.day +
              oldDaytime.startTimeHhmm +
              oldDaytime.endTimeHhmm +
              newDaytime.day +
              newDaytime.startTimeHhmm +
              newDaytime.endTimeHhmm +
              title
            }
          >
            <Clock className="h-4 opacity-50" />
            <Diff oldStr={oldDaytime.day} newStr={newDaytime.day} />{" "}
            <Diff
              oldStr={`${oldDaytime.startTimeHhmm}-${oldDaytime.endTimeHhmm}`}
              newStr={`${newDaytime.startTimeHhmm}-${newDaytime.endTimeHhmm}`}
            />
          </div>
        ))}

      {Iter.from(oldDaytimes)
        .skip(minLen)
        .map((dayTime) => (
          <div
            className={cn("flex items-center gap-2", redText)}
            key={
              dayTime.day + dayTime.startTimeHhmm + dayTime.endTimeHhmm + title
            }
          >
            <Clock className="h-4 opacity-50" />
            {dayTime.day} {dayTime.startTimeHhmm}-{dayTime.endTimeHhmm}
          </div>
        ))}

      {Iter.from(newDaytimes)
        .skip(minLen)
        .map((dayTime) => (
          <div
            className={cn("flex items-center gap-2", greenText)}
            key={
              dayTime.day + dayTime.startTimeHhmm + dayTime.endTimeHhmm + title
            }
          >
            <Clock className="h-4 opacity-50" />
            {dayTime.day} {dayTime.startTimeHhmm}-{dayTime.endTimeHhmm}
          </div>
        ))}
    </>
  );
}

export function Diff({ oldStr, newStr }: { oldStr: string; newStr: string }) {
  return oldStr === newStr ? (
    oldStr
  ) : (
    <>
      <span className={cn(redText)}>{oldStr}</span>
      {" → "}
      <span className={cn(greenText)}>{newStr}</span>
    </>
  );
}
