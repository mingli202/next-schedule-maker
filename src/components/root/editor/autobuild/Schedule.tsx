import { ChevronRight, Save } from "lucide-react";
import { Fragment } from "react";
import { getColorFromIndex } from "src/lib/colors";
import { useSectionStore } from "src/lib/store/section";
import { cn } from "src/lib/utils";
import type { SavedSection } from "src/types/schedule";
import Button from "@/components/Button";

const minWidth = 224;

type Props = {
  schedule: SavedSection[];
  index: number;
  onScheduleSelected: (schedule: SavedSection[]) => void;
  onScheduleSaved: (schedule: SavedSection[]) => void;
};

function Schedule({
  schedule,
  index,
  onScheduleSelected,
  onScheduleSaved,
}: Props) {
  const { sectionsById } = useSectionStore();

  return (
    <div
      className={cn(
        "relative box-border flex w-full flex-col",
        "bg-secondary/50 gap-2 rounded-xl p-2",
      )}
    >
      <div className="flex w-full flex-wrap gap-2">
        <div
          className="box-border grid h-40 flex-1 grid-cols-5 grid-rows-[repeat(20,1fr)] overflow-hidden rounded-md bg-slate-300"
          style={{ minWidth }}
        >
          {schedule.map(({ sectionId, colorIndex }, index) => {
            const section = sectionsById.get(sectionId);

            if (!section) {
              return null;
            }

            const { textColor, bgColor } = getColorFromIndex(colorIndex);

            return (
              <Fragment
                key={`${sectionId}${index.toString()}${section.code}${section.section}`}
              >
                {section.viewData.map((c, i) => {
                  const [day, [start, end]] = Object.entries(c)[0];

                  return (
                    <div
                      key={`autobuild-schedule-section-${index.toString()}${day}${section.code}${section.section}${i.toString()}`}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        gridColumn: day,
                        gridRowStart: start,
                        gridRowEnd: end,
                      }}
                      className="flex items-center justify-center overflow-hidden text-xs"
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
        </div>

        <div className="box-border flex-1" style={{ minWidth }}>
          {schedule.map(({ sectionId, colorIndex }, i) => {
            const section = sectionsById.get(sectionId);

            if (!section) {
              return null;
            }

            const { textColor, bgColor } = getColorFromIndex(colorIndex);

            const leclab = section.leclabs.find((leclab) => leclab.prof !== "");

            return (
              <div
                key={`autobuild-schedule-legend-${index}${bgColor}${i.toString()}${sectionId}${section.code}`}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-sm"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold">
                    {section.code} {section.title}
                  </p>
                  <p>
                    {section.section} {leclab?.prof}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="ml-1">{index + 1}</span>
        <div className="flex">
          <Button
            variant="basic"
            className="w-fit"
            onClick={() => onScheduleSaved(schedule)}
          >
            <Save />
          </Button>

          <Button
            variant="basic"
            className="w-fit"
            title="select"
            onClick={() => onScheduleSelected(schedule)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
