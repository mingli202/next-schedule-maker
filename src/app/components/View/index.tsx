"use client";

import GridView from "./GridView";
import PreviewHover from "./PreviewHover";
import { Class, SharedCurrentClasses, StateType } from "@/types";
import { cn } from "@/lib";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  disableRemove?: boolean;
  allClasses: Record<string, Class>;
  stateType: StateType;
  scheduleClasses: SharedCurrentClasses[];
  disableTime?: boolean;
};

function View({
  className,
  disableRemove,
  allClasses,
  stateType,
  scheduleClasses,
  disableTime,
}: Props) {
  return (
    <div
      className={cn(
        "relative box-border grid w-full",
        "rounded-md bg-primary p-2 text-bgPrimary md:p-4",

        disableTime
          ? "h-full grid-cols-5 grid-rows-[repeat(20,1fr)] md:h-full md:w-full md:p-2"
          : "h-[40rem] grid-cols-[2rem_repeat(5,1fr)] grid-rows-[repeat(21,1fr)] md:h-full md:min-w-[40rem] md:grid-cols-[3rem_repeat(5,1fr)]",

        className,
      )}
    >
      {!disableTime && (
        <>
          <p className="absolute left-0 top-0 col-span-1 row-span-1 p-2 text-[0.5rem] md:text-xs">
            Fall 2024
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
          "h-full rounded-md bg-slate shadow-lg shadow-bgPrimary/30",
          "text-[8px] leading-[10px] md:text-[14px] md:leading-[14px]",

          disableTime
            ? "col-span-full row-span-full md:text-[10px] md:leading-[10px]"
            : "col-span-5 row-[span_20/span_20]",
        )}
      >
        <div className="absolute left-0 top-0 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)]">
          <div className="col-span-full row-span-1" />
          {Array(19)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index}
                  className="col-span-full row-span-1 mx-2 box-border h-[1px] -translate-y-1/2 rounded-full bg-gray-400"
                ></div>
              );
            })}
        </div>

        <div className="absolute left-0 top-0 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)]">
          <div className="invisible row-span-full" />
          {Array(4)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index}
                  className="row-span-full my-2 box-border w-[1px] -translate-x-1/2 rounded-full bg-gray-400"
                ></div>
              );
            })}
        </div>

        <GridView
          allClasses={allClasses}
          stateType={stateType}
          disableRemove={disableRemove}
          scheduleClasses={scheduleClasses}
          disableTime={disableTime}
        />
        <PreviewHover allClasses={allClasses} />
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
