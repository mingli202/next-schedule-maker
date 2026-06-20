import { ComponentProps, useMemo } from "react";
import { useSavedSchedule } from "src/hooks";
import isValidAdditionToSchedule from "src/lib/schedule/isValidAdditionToSchedule";
import { useSectionStore } from "src/lib/store/section";
import { cn } from "src/lib/utils";
import type { Section } from "src/types/generated";

const red = "bg-red-300";
const green = "bg-green-300";

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
          <div className={cn("h-2 w-2 rounded-full", red)} /> old
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("h-2 w-2 rounded-full", green)} /> new
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
              className={cn("z-10", red)}
              index={i}
            />
            {newSection && (
              <SectionTimes
                section={newSection}
                key={`new-${id}-section-${newSection.id}`}
                className={cn("z-10", green)}
                index={i}
              />
            )}
          </>
        ))}
      </div>
      {modifiedSections.map(({ oldSection, newSection }, i) => (
        <div
          key={`modified-${id}-section-details-${oldSection.id}`}
          className="flex w-full gap-2"
        >
          <div className="rounded-md p-2">{i + 1}</div>
        </div>
      ))}
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
          "bg-background/30 flex items-center justify-center overflow-hidden rounded-xs text-xs text-black mix-blend-multiply",
          className,
        )}
      >
        {index === undefined ? null : index + 1}
      </div>
    );
  });
}

function OverlappingDiv({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("bg-view-bg relative", className)}>
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-full mix-blend-multiply",
          red,
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-full mix-blend-multiply",
          green,
        )}
      />
      {children}
    </div>
  );
}
