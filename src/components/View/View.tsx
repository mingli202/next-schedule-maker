import { cn } from "src/lib/utils";
import type { SavedSection } from "@/types/schedule";
import GridView from "./GridView";
import PreviewHover from "./PreviewHover";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  // disable the remove button
  disableRemove?: boolean;

  // can't expand or remove section
  // no time and no indicator either
  // used in the home page for the background schedules
  disableControls?: boolean;

  // the sections to view
  savedSections: SavedSection[];
};

function View({
  className,
  disableRemove,
  disableControls,
  savedSections,
}: Props) {
  return (
    <div
      className={cn(
        "relative box-border grid w-full",
        "bg-primary text-primary-foreground rounded-md p-2 md:p-4",

        disableControls
          ? "h-full grid-cols-5 grid-rows-[repeat(20,1fr)] md:h-full md:w-full md:p-2"
          : "h-160 grid-cols-[2rem_repeat(5,1fr)] grid-rows-[repeat(21,1fr)] md:h-full md:min-w-160 md:grid-cols-[3rem_repeat(5,1fr)]",

        className,
      )}
    >
      {!disableControls && (
        <>
          <p className="absolute top-0 left-0 col-span-1 row-span-1 p-2 text-[0.5rem] md:text-xs">
            Winter 2026 (December 11 pdf)
          </p>
          <div className="grid-rows-[repeat(20,1fr) col-span-1 row-[span_21/span_21] mr-4 grid grid-cols-1">
            <Hours />
          </div>
          <div className="col-span-5 col-start-2 flex">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
              <span
                key={day}
                className="line-clamp-1 flex basis-1/5 items-center justify-center max-md:text-xs"
              >
                {day}
              </span>
            ))}
          </div>
        </>
      )}

      <div
        className={cn(
          "relative grid grid-cols-5 grid-rows-[repeat(20,1fr)]",
          "shadow-background/30 h-full rounded-md bg-slate-300 shadow-lg",
          "text-[8px] leading-2.5 md:text-[14px] md:leading-3.5",

          disableControls
            ? "col-span-full row-span-full md:text-[10px] md:leading-2.5"
            : "col-span-5 row-[span_20/span_20]",
        )}
      >
        <div className="absolute top-0 left-0 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)]">
          <div className="col-span-full row-span-1" />
          {Array(19)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index.toString()}
                  className="col-span-full row-span-1 mx-2 box-border h-px -translate-y-1/2 rounded-full bg-gray-400"
                ></div>
              );
            })}
        </div>

        <div className="absolute top-0 left-0 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)]">
          <div className="invisible row-span-full" />
          {Array(4)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index.toString()}
                  className="row-span-full my-2 box-border w-px -translate-x-1/2 rounded-full bg-gray-400"
                ></div>
              );
            })}
        </div>

        <GridView
          disableRemove={disableRemove}
          savedSections={savedSections}
          disableControls={disableControls}
        />
        {!disableControls && <PreviewHover />}
      </div>
    </div>
  );
}

function Hours() {
  const initalMinutes = 8 * 60;

  const hours = Array(21)
    .fill(0)
    .map((_, index) => {
      const totalMinutes = index * 30 + initalMinutes;

      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;

      return `${hour}:${minute === 0 ? "00" : minute}`;
    });

  return (
    <>
      {hours.map((h) => (
        <div
          key={h}
          className="flex translate-y-1/2 items-center text-[0.5rem] opacity-60 md:text-xs"
        >
          {h}
        </div>
      ))}
    </>
  );
}

export default View;
