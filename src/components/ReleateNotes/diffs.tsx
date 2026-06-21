import { Clock, User } from "lucide-react";
import { capitalize, cn } from "src/lib/utils";
import type { DayTime, LecLab } from "src/types/generated";
import LecLabComponent from "../LecLab";
import TeacherStats from "../TeacherStats";
import { greenText, redText } from "./colors";

type MatchedOldItem<T> = {
  oldItem: T;
  oldIndex: number;
  newItem?: T;
  newIndex?: number;
};

function matchByStableKeys<T>(
  oldItems: T[],
  newItems: T[],
  keyFns: Array<(item: T) => string>,
) {
  const matchedNewByOldIndex = new Map<number, number>();
  const remainingNewIndices = new Set(newItems.map((_, i) => i));

  for (const keyFn of keyFns) {
    const newIndicesByKey = new Map<string, number[]>();

    for (const newIndex of remainingNewIndices) {
      const key = keyFn(newItems[newIndex]);
      const indices = newIndicesByKey.get(key);

      if (indices) {
        indices.push(newIndex);
      } else {
        newIndicesByKey.set(key, [newIndex]);
      }
    }

    for (const [oldIndex, oldItem] of oldItems.entries()) {
      if (matchedNewByOldIndex.has(oldIndex)) continue;

      const key = keyFn(oldItem);
      const candidates = newIndicesByKey.get(key);
      const matchedNewIndex = candidates?.shift();
      if (matchedNewIndex === undefined) continue;

      matchedNewByOldIndex.set(oldIndex, matchedNewIndex);
      remainingNewIndices.delete(matchedNewIndex);
    }
  }

  const matchedOldItems = oldItems.map(
    (oldItem, oldIndex): MatchedOldItem<T> => {
      const matchedNewIndex = matchedNewByOldIndex.get(oldIndex);
      if (matchedNewIndex === undefined) {
        return {
          oldItem,
          oldIndex,
        };
      }

      return {
        oldItem,
        oldIndex,
        newItem: newItems[matchedNewIndex],
        newIndex: matchedNewIndex,
      };
    },
  );

  const addedNewItems = [...remainingNewIndices]
    .sort((a, b) => a - b)
    .map((newIndex) => ({
      item: newItems[newIndex],
      index: newIndex,
    }));

  return {
    matchedOldItems,
    addedNewItems,
  };
}

const dayTimeExactKey = (dayTime: DayTime) =>
  `${dayTime.day}|${dayTime.startTimeHhmm}|${dayTime.endTimeHhmm}`;

const dayTimeDayKey = (dayTime: DayTime) => dayTime.day;

const dayTimeTimeKey = (dayTime: DayTime) =>
  `${dayTime.startTimeHhmm}|${dayTime.endTimeHhmm}`;

const leclabExactKey = (leclab: LecLab) =>
  `${leclab.type ?? "lecture"}|${leclab.title}|${leclab.prof}|${[...leclab.dayTimes].map(dayTimeExactKey).sort().join(",")}`;

const leclabTypeAndTitleKey = (leclab: LecLab) =>
  `${leclab.type ?? "lecture"}|${leclab.title}`;

export function LeclabsDiff({
  sectionId,
  oldLeclabs,
  newLecLabs,
}: {
  sectionId: string;
  oldLeclabs: LecLab[];
  newLecLabs: LecLab[];
}) {
  const { matchedOldItems, addedNewItems } = matchByStableKeys(
    oldLeclabs,
    newLecLabs,
    [leclabExactKey, leclabTypeAndTitleKey],
  );

  return (
    <>
      {matchedOldItems.map(({ oldItem, newItem, oldIndex, newIndex }) =>
        newItem ? (
          <LecLabDiff
            key={`${sectionId}-leclabdiff-old-${oldIndex.toString()}-new-${newIndex?.toString() ?? "missing"}`}
            oldLeclab={oldItem}
            newLeclab={newItem}
          />
        ) : (
          <LecLabComponent
            key={`${sectionId}-extraoldleclab-${oldIndex.toString()}`}
            leclab={oldItem}
            className={cn(redText, "bg-red-900")}
          />
        ),
      )}
      {addedNewItems.map(({ item, index }) => (
          <LecLabComponent
            key={`${sectionId}-extranewleclab-${index.toString()}`}
            leclab={item}
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
          <span>
            {oldLeclab.prof} <TeacherStats leclab={oldLeclab} />
          </span>
        ) : (
          <div className="flex w-full flex-col">
            <span className={redText}>
              {oldLeclab.prof} <TeacherStats leclab={oldLeclab} />
            </span>
            <span className={greenText}>
              {newLeclab.prof} <TeacherStats leclab={newLeclab} />
            </span>
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
  const { matchedOldItems, addedNewItems } = matchByStableKeys(
    oldDaytimes,
    newDaytimes,
    [dayTimeExactKey, dayTimeDayKey, dayTimeTimeKey],
  );

  return (
    <>
      {matchedOldItems.map(({ oldItem, newItem, oldIndex, newIndex }) =>
        newItem ? (
          <div
            className="flex items-center gap-2"
            key={`${title}-daytime-old-${oldIndex.toString()}-new-${newIndex?.toString() ?? "missing"}`}
          >
            <Clock className="h-4 opacity-50" />
            <Diff oldStr={oldItem.day} newStr={newItem.day} />{" "}
            <Diff
              oldStr={`${oldItem.startTimeHhmm}-${oldItem.endTimeHhmm}`}
              newStr={`${newItem.startTimeHhmm}-${newItem.endTimeHhmm}`}
            />
          </div>
        ) : (
          <div
            className={cn("flex items-center gap-2", redText)}
            key={`${title}-removed-daytime-${oldIndex.toString()}`}
          >
            <Clock className="h-4 opacity-50" />
            {oldItem.day} {oldItem.startTimeHhmm}-{oldItem.endTimeHhmm}
          </div>
        ),
      )}
      {addedNewItems.map(({ item, index }) => (
          <div
            className={cn("flex items-center gap-2", greenText)}
            key={`${title}-added-daytime-${index.toString()}`}
          >
            <Clock className="h-4 opacity-50" />
            {item.day} {item.startTimeHhmm}-{item.endTimeHhmm}
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
