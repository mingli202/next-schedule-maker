import { useMemo } from "react";
import { useSavedSchedule } from "src/hooks";
import { useSectionStore } from "src/lib/store/section";
import { cn } from "src/lib/utils";
import type { Section } from "src/types/generated";

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
          }

          // oldSchedule.sort((a, b) => compare(a.id, b.id));
          // currentSchedule.sort((a, b) => compare(a.id, b.id));

          return {
            id: savedSchedule.id,
            name: savedSchedule.name,
            unchangedSections,
            modifiedSections,
          } as const;
        }),
    [schedules, allModifiedSectionsById, sectionsById],
  );

  return (
    <div className="bg-background ring-secondary flex basis-2/5 flex-col gap-2 rounded-md p-3 ring-2">
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-400" /> old
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-emerald-400" /> new
        </div>
      </div>
      <div>Affected schedules ({affectedSchedules.length})</div>
      {affectedSchedules.map(({ id, ...schedules }) => (
        <ScheduleDiff key={id} {...schedules} id={id} />
      ))}
    </div>
  );
}

type ScheduleDiffProps = {
  id: string;
  name: string;
  unchangedSections: Section[];
  modifiedSections: ModifiedSection[];
};
function ScheduleDiff({
  id,
  name,
  unchangedSections,
  modifiedSections,
}: ScheduleDiffProps) {
  return (
    <div className="bg-secondary/50 flex flex-col gap-2 rounded-sm p-2">
      <p>{name}</p>
      <div className="bg-view-bg grid h-40 w-full grid-cols-5 grid-rows-[repeat(20,1fr)] rounded-xs">
        {unchangedSections.map((section) => (
          <SectionTimes
            section={section}
            key={`unchanged-${id}-section-${section.id}`}
          />
        ))}

        {modifiedSections.map(({ oldSection, newSection }) => (
          <>
            <SectionTimes
              section={oldSection}
              key={`old-${id}-section-${oldSection.id}`}
              className="bg-red-400"
            />
            {newSection && (
              <SectionTimes
                section={newSection}
                key={`new-${id}-section-${newSection.id}`}
                className="bg-emerald-400"
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

function SectionTimes({
  section,
  className,
}: {
  section: Section;
  className?: string;
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
          "bg-background/30 flex items-center justify-center overflow-hidden rounded-xs text-xs mix-blend-darken",
          className,
        )}
      />
    );
  });
}
