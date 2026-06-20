import { useMemo } from "react";
import { useSavedSchedule } from "src/hooks";
import { useSectionStore } from "src/lib/store/section";
import type { Section } from "src/types/generated";

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
        .map((schedule) => {
          const oldSchedule: Section[] = [];
          const currentSchedule: Section[] = [];

          for (const section of schedule.sections) {
            const id = section.sectionId;
            const fullSection = sectionsById.get(id);

            if (id in allModifiedSectionsById) {
              oldSchedule.push(allModifiedSectionsById[id]);
            } else if (fullSection !== undefined) {
              oldSchedule.push(fullSection);
            }

            if (fullSection !== undefined) {
              currentSchedule.push(fullSection);
            }
          }

          return { id: schedule.id, oldSchedule, currentSchedule } as const;
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
      <div>Affected schedules</div>
      {affectedSchedules.map(({ id, ...schedules }) => (
        <ScheduleDiff key={id} {...schedules} />
      ))}
    </div>
  );
}

type ScheduleDiffProps = {
  oldShedule: Section[];
  currentSchedule: Section[];
};
function ScheduleDiff() {
  return null;
}
