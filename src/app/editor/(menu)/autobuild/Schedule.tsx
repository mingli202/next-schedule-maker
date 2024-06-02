"use client";

import { Class, SharedCurrentClasses } from "@/types";
import { Button } from "@/ui";
import { faChevronRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import { ScheduleDispatchContext } from "../../ScheduleContext";
import { app, db } from "@/backend";
import { push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { cn } from "@/lib";

type Props = {
  schedule: SharedCurrentClasses[];
  allClasses: Record<string, Class>;
  scroll: number;
  setOver: Dispatch<SetStateAction<number>>;
  index: number;
};

function Schedule({ schedule, allClasses, scroll, setOver, index }: Props) {
  const dispatch = useContext(ScheduleDispatchContext);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bounds = divRef.current!.getBoundingClientRect();

    if (bounds.bottom <= 0) {
      setOver(index);
    }
  }, [index, setOver, scroll]);

  return (
    <div
      className={cn(
        "relative box-border grid w-full grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]",
        "gap-2 rounded-md bg-bgSecondary p-2",
      )}
      ref={divRef}
    >
      <div className="grid h-[10rem] w-full grid-cols-5 grid-rows-[repeat(20,1fr)] overflow-hidden rounded-md bg-slate">
        {schedule.map(({ id, bgColor, textColor }, index) => {
          const cl = allClasses[id];

          return (
            <Fragment key={id + `${index}` + cl.code + cl.section}>
              {cl.viewData.map((c, i) => {
                const [day, [start, end]] = Object.entries(c)[0];

                return (
                  <div
                    key={day + cl.code + cl.section + `${i}`}
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

      <div>
        {schedule.map(({ bgColor, id, textColor }, i) => {
          const { section, code, lecture } = allClasses[id];

          return (
            <div
              key={bgColor + `${i}`}
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
                  {code} {lecture.title}
                </p>
                <p>
                  {section} {lecture.prof}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-span-full flex items-center justify-between">
        <span className="ml-1">{index + 1}</span>
        <div className="flex">
          {/* TODO: remove this button */}
          <Button onClick={() => console.log(schedule)}>d</Button>
          <Button
            variant="basic"
            className="w-fit"
            onClick={async function () {
              const user = getAuth(app).currentUser;

              if (!user) return;

              const newSchedule = {
                data: schedule,
                name: `Untitled`,
              } as const;

              await set(
                push(ref(db, `/users/${user.uid}/schedules`)),
                newSchedule,
              ).catch((err) => console.log(err));
            }}
          >
            <FontAwesomeIcon icon={faDownload} className="h-4" />
          </Button>

          <Button
            variant="basic"
            className="w-fit"
            onClick={() => dispatch({ type: "set", schedule })}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
