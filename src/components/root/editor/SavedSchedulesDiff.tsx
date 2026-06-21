import { Clock, User } from "lucide-react";
import { type ComponentProps, useMemo } from "react";
import LecLabComponent from "src/components/LecLab";
import TeacherStats from "src/components/TeacherStats";
import { useSavedSchedule } from "src/hooks";
import { Iter } from "src/lib/iter";
import isValidAdditionToSchedule from "src/lib/schedule/isValidAdditionToSchedule";
import { useSectionStore } from "src/lib/store/section";
import { capitalize, cn } from "src/lib/utils";
import type { DayTime, LecLab, Section } from "src/types/generated";

const red = "red-300";
const green = "green-300";

const redBg = `bg-${red}`;
const greenBg = `bg-${green}`;

const redText = `text-${red}`;
const greenText = `text-${green}`;

type ModifiedSection = {
  oldSection: Section;
  newSection?: Section;
};

type SavedSchedulesDiffProps = {
  sectionsRemoved: Section[];
  previousSectionsChanged: Section[];
};
export function SavedSchedulesDiff({
  sectionsRemoved,
  previousSectionsChanged,
}: SavedSchedulesDiffProps) {
  const { schedules } = useSavedSchedule();
  const { sectionsById } = useSectionStore();

  const sectionsRemovedById = useMemo(
    () => Object.fromEntries(sectionsRemoved.map((s) => [s.id, s])),
    [sectionsRemoved],
  );

  const previousSectionsChangedById = useMemo(
    () => Object.fromEntries(previousSectionsChanged.map((s) => [s.id, s])),
    [previousSectionsChanged],
  );

  const allModifiedSectionsById = useMemo(
    () => ({
      ...sectionsRemovedById,
      ...previousSectionsChangedById,
    }),
    [sectionsRemovedById, previousSectionsChangedById],
  );

  const affectedSchedules = useMemo(
    () =>
      schedules
        .filter((schedule) =>
          schedule.sections.some(
            (section) => section.sectionId in allModifiedSectionsById,
          ),
        )
        .map((savedSchedule) => {
          const unchangedSections: Section[] = [];
          const modifiedSections: ModifiedSection[] = [];

          const fullSchedule: Section[] = [];
          let isValid = true;

          for (const section of savedSchedule.sections) {
            const id = section.sectionId;
            const fullSection = sectionsById.get(id);

            if (id in allModifiedSectionsById) {
              modifiedSections.push({
                oldSection: allModifiedSectionsById[id],
                newSection: fullSection,
              });
            } else if (fullSection !== undefined) {
              unchangedSections.push(fullSection);
            }

            if (isValid && fullSection !== undefined) {
              isValid = isValidAdditionToSchedule(fullSection, fullSchedule);

              fullSchedule.push(fullSection);
            }
          }

          return {
            id: savedSchedule.id,
            name: savedSchedule.name,
            unchangedSections,
            modifiedSections,
            isValid,
          } as const;
        }),
    [schedules, allModifiedSectionsById, sectionsById],
  );

  return (
    <div className="bg-background ring-secondary flex basis-2/5 flex-col gap-2 rounded-md p-3 ring-2">
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <div className={cn("h-2 w-2 rounded-full", redBg)} /> old
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("h-2 w-2 rounded-full", greenBg)} /> new
        </div>
        <div className="flex items-center gap-1">
          <OverlappingDiv className="h-2 w-2 rounded-full" /> overlap
        </div>
      </div>
      <div>Affected schedules ({affectedSchedules.length})</div>
      <div className="w-full flex-1 overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-2">
          {affectedSchedules.map(({ id, ...schedules }) => (
            <ScheduleDiff key={id} {...schedules} id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ScheduleDiffProps = {
  id: string;
  name: string;
  unchangedSections: Section[];
  modifiedSections: ModifiedSection[];
  isValid: boolean;
};
function ScheduleDiff({
  id,
  name,
  unchangedSections,
  modifiedSections,
  isValid,
}: ScheduleDiffProps) {
  return (
    <div className="bg-secondary/50 flex flex-col gap-2 rounded-sm p-2">
      <p>
        {name}{" "}
        {!isValid && <span className="text-destructive">(now invalid)</span>}
      </p>
      <div className="bg-view-bg grid h-40 w-full grid-cols-5 grid-rows-[repeat(20,1fr)] rounded-xs">
        {unchangedSections.map((section) => (
          <SectionTimes
            section={section}
            key={`unchanged-${id}-section-${section.id}`}
          />
        ))}

        {modifiedSections.map(({ oldSection, newSection }, i) => (
          <>
            <SectionTimes
              section={oldSection}
              key={`old-${id}-section-${oldSection.id}`}
              className={cn("z-10", redBg)}
              index={i}
            />
            {newSection && (
              <SectionTimes
                section={newSection}
                key={`new-${id}-section-${newSection.id}`}
                className={cn("z-10", greenBg)}
                index={i}
              />
            )}
          </>
        ))}
      </div>

      {modifiedSections.map(({ oldSection, newSection }, i) => {
        const El = newSection
          ? OverlappingDiv
          : ({ className, ...props }: ComponentProps<"div">) => (
              <div className={cn(redBg, className)} {...props} />
            );

        return (
          <div
            key={`modified-${id}-section-details-${oldSection.id}`}
            className="flex w-full gap-2"
          >
            <El className="text-background flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-sm">
              {i + 1}
            </El>
            <div className="flex w-full flex-col gap-1">
              <p>
                {oldSection.code} {oldSection.section}{" "}
                {newSection ? null : (
                  <span className={cn(redText)}>(removed)</span>
                )}
              </p>
              {newSection && (
                <>
                  {oldSection.course !== newSection.course && (
                    <Diff
                      oldStr={oldSection.course}
                      newStr={newSection.course}
                    />
                  )}
                  {oldSection.domain !== newSection.domain && (
                    <Diff
                      oldStr={oldSection.domain}
                      newStr={newSection.domain}
                    />
                  )}
                  {oldSection.title !== newSection.title && (
                    <Diff oldStr={oldSection.title} newStr={newSection.title} />
                  )}
                  <LeclabsDiff
                    oldLeclabs={oldSection.leclabs}
                    newLecLabs={newSection.leclabs}
                    sectionId={oldSection.id}
                  />
                  {oldSection.more !== newSection.more && (
                    <Diff oldStr={oldSection.more} newStr={newSection.more} />
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionTimes({
  section,
  className,
  index,
}: {
  section: Section;
  className?: string;
  index?: number;
}) {
  return section.viewData.map((c, i) => {
    const [day, [start, end]] = Object.entries(c)[0];

    return (
      <div
        key={`autobuild-schedule-section-${day}${section.code}${section.section}${i.toString()}`}
        style={{
          gridColumn: day,
          gridRowStart: start,
          gridRowEnd: end,
        }}
        className={cn(
          "bg-background/30 text-background flex items-center justify-center overflow-hidden rounded-xs text-xs mix-blend-multiply",
          className,
        )}
      >
        {index === undefined ? null : index + 1}
      </div>
    );
  });
}

function LeclabsDiff({
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

function LecLabDiff({
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

function DaytimesDiff({
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

function OverlappingDiv({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("bg-view-bg relative z-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute top-0 left-0 -z-1 h-full w-full mix-blend-multiply",
          redBg,
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 -z-1 h-full w-full mix-blend-multiply",
          greenBg,
        )}
      />
      {children}
    </div>
  );
}

function Diff({ oldStr, newStr }: { oldStr: string; newStr: string }) {
  return oldStr === newStr ? (
    oldStr
  ) : (
    <span>
      <span className={cn(redText)}>{oldStr}</span>
      {" -> "}
      <span className={cn(greenText)}>{newStr}</span>
    </span>
  );
}

type ChangedSectionPreviewCardProps = {
  oldSection: Section;
  newSection: Section;
  className?: string;
};
export function ChangedSectionPreviewCard({
  oldSection,
  newSection,
  className,
}: ChangedSectionPreviewCardProps) {
  return (
    <div
      className={cn(
        "bg-secondary/50 flex flex-col gap-2 rounded-xl p-2",
        className,
      )}
    >
      <div>
        <h2 className="font-light">
          <Diff oldStr={oldSection.course} newStr={newSection.course} />
          {": "}
          <Diff oldStr={oldSection.domain} newStr={newSection.domain} />{" "}
          <Diff oldStr={oldSection.code} newStr={newSection.code} />
        </h2>

        <h1 className="font-heading text-base font-bold md:text-xl">
          <Diff oldStr={oldSection.section} newStr={newSection.section} />{" "}
          <Diff oldStr={oldSection.title} newStr={newSection.title} />
        </h1>
      </div>

      <LeclabsDiff
        oldLeclabs={oldSection.leclabs}
        newLecLabs={newSection.leclabs}
        sectionId={oldSection.id}
      />

      {oldSection.more !== "" || newSection.more !== "" ? (
        <p className="opacity-70">
          <Diff oldStr={oldSection.more} newStr={newSection.more} />
        </p>
      ) : null}
    </div>
  );
}
