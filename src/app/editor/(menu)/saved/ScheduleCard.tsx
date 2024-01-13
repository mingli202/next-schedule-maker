"use client";

import { cn } from "@/lib";
import { Class, Saved } from "@/types";
import { Button } from "@/ui";
import {
  faCheckCircle,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, HTMLAttributes, useContext, useState } from "react";
import { ScheduleDispatchContext } from "../../ScheduleContext";
import transform from "./transform";
import { ref, set } from "firebase/database";
import { db } from "@/backend";
import { HTMLMotionProps, motion } from "framer-motion";
import { SetCurrentClassesContext } from "@/app/user/Context";
import { useRouter } from "next/navigation";

type Props = {
  schedule: Saved;
  allClasses?: Record<string, Class>;
  colors: string[];
  uid: string | null;
  savedSchedules: Saved[];
  userSaved?: boolean;
  userPreview?: boolean;
};

const ScheduleCard = ({
  schedule,
  className,
  allClasses,
  colors,
  uid,
  savedSchedules,
  userSaved,
  userPreview,
  ...props
}: Props & HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) => {
  const dispatch = useContext(ScheduleDispatchContext);
  const setCurrentSchedule = useContext(SetCurrentClassesContext);
  const router = useRouter();

  const [editName, setEditName] = useState(false);

  return (
    <motion.div
      className={cn(
        "flex h-fit w-full flex-col gap-1 rounded-md bg-bgSecondary p-1",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "col-span-5 row-[span_20/span_20] grid h-20 w-full shrink-0 grid-cols-5 grid-rows-[repeat(20,1fr)] overflow-hidden rounded-md bg-slate ",
          {
            "cursor-pointer transition hover:bg-slate/80":
              allClasses || userPreview,
          },
        )}
        title="select"
        onClick={() => {
          if (!allClasses) return;

          const classes = Object.entries(allClasses);

          if (!schedule.data) {
            dispatch({ type: "set", schedule: [] });
            return;
          }

          try {
            const scheduleToShow = schedule.data.map((cl, i) => {
              const id = transform(cl.count, classes);
              const bgColor = colors[i];
              const textColor = i > 7 ? "#FFF" : "#000";

              return {
                id,
                bgColor,
                textColor,
              };
            });

            if (userSaved) {
              setCurrentSchedule(scheduleToShow);
              if (userPreview) {
                router.push("/user/saved");
              }
            } else {
              dispatch({
                type: "set",
                schedule: scheduleToShow,
              });
            }
          } catch {
            alert("Only Winter 2024 Classes are allowed.");
          }
        }}
      >
        {schedule.data &&
          schedule.data.map((sch, index) => {
            const bgColor = colors[index];

            return (
              <Fragment key={sch.code + sch.section + "course"}>
                {sch.viewData.map((s, i) => {
                  const [day, [start, end]] = Object.entries(s)[0];

                  return (
                    <div
                      className="rounded-sm"
                      style={{
                        gridColumn: day,
                        gridRowStart: start,
                        gridRowEnd: end,
                        backgroundColor: bgColor,
                      }}
                      key={sch.code + sch.section + day + `${i}`}
                    />
                  );
                })}
              </Fragment>
            );
          })}
      </div>

      <div className="flex h-full items-center justify-between gap-2">
        {editName ? (
          <form
            className="box-border flex basis-full items-center overflow-hidden rounded-md bg-bgPrimary"
            action={async (formdata) => {
              if (!uid) return;
              const name = formdata.get("name")?.toString() ?? "Untitled";

              const dbRef = ref(db, `/users/${uid}/schedules`);

              const scheduleToPush = savedSchedules.map((sch) => {
                if (sch.id !== schedule.id) return sch;
                return {
                  ...sch,
                  name,
                };
              });

              await set(dbRef, scheduleToPush).catch((err) => console.log(err));
              setEditName(false);
            }}
          >
            <input
              name="name"
              id="name"
              className="w-full bg-bgPrimary outline-none"
              defaultValue={schedule.name}
              autoFocus
            />
            <Button variant="basic" type="submit" className="shrink-0 p-1">
              <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
            </Button>

            <Button
              variant="basic"
              type="button"
              onClick={() => setEditName(false)}
              className="shrink-0 p-1"
            >
              <FontAwesomeIcon icon={faXmarkCircle} className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <>
            <p
              className="cursor-pointer"
              onClick={() => setEditName(true)}
              title="edit"
            >
              {schedule.name && schedule.name !== ""
                ? schedule.name
                : "Untitled"}
            </p>
            <Button
              title="delete"
              variant="basic"
              className="shrink-0 p-1"
              onClick={async () => {
                if (!uid) return;

                const schedules = savedSchedules.filter(
                  (sch) => sch.id !== schedule.id,
                );

                console.log(schedules);

                const dbref = ref(db, `/users/${uid}/schedules`);
                await set(dbref, schedules);
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ScheduleCard;
