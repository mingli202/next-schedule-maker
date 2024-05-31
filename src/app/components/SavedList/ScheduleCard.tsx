"use client";

import { cn } from "@/lib";
import { Class, Saved, StateType } from "@/types";
import { Button } from "@/ui";
import {
  faCheckCircle,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, HTMLAttributes, useState } from "react";
import { ref, remove, update } from "firebase/database";
import { app, db } from "@/backend";
import { HTMLMotionProps, motion } from "framer-motion";

import { getAuth } from "firebase/auth";

type Props = {
  schedule: Saved;
  allClasses: Record<string, Class>;
  handleHighlight: () => void;
  highlight?: string;
  noEdit?: boolean;
  schId: string;
  customSelect?: (id: string, s: Saved) => void;
  stateType: StateType;
};

function ScheduleCard({
  schedule,
  className,
  allClasses,
  handleHighlight,
  schId,
  stateType,
  noEdit,
  highlight,
  customSelect,
  ...props
}: Props & HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) {
  const [editName, setEditName] = useState(false);

  const nameChange = async (formdata: FormData) => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const name = formdata.get("name")?.toString() ?? "Untitled";

    const dbRef = ref(db, `/users/${user.uid}/schedules`);

    await update(dbRef, {
      [schId]: { ...schedule, name },
    }).catch((err) => console.log(err));
    setEditName(false);
  };

  const deleteSchedule = async () => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const dbref = ref(db, `/users/${user.uid}/schedules/${schId}`);
    await remove(dbref);
  };

  const select = () => {
    if (stateType === "none") return;

    if (!schedule.data) {
      if (stateType.type == "dispatch") {
        stateType.dispatch({ type: "set", schedule: [] });
      } else {
        stateType.dispatch([]);
      }
      return;
    }

    try {
      if (stateType.type == "dispatch") {
        stateType.dispatch({
          type: "set",
          schedule: schedule.data,
        });
      } else {
        stateType.dispatch(schedule.data);
      }
    } catch {
      alert("Only Winter 2024 Classes are allowed.");
    }
  };

  return (
    <motion.div
      className={cn(
        "flex h-fit w-full flex-col gap-1 rounded-md bg-bgSecondary p-1 transition",
        {
          "bg-secondary": highlight === schId,
        },
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "col-span-5 row-[span_20/span_20] grid h-20 w-full shrink-0 cursor-pointer grid-cols-5 grid-rows-[repeat(20,1fr)] overflow-hidden rounded-md bg-slate transition hover:bg-slate/90",
        )}
        title="select"
        onClick={() => {
          handleHighlight();
          select();

          if (customSelect) {
            customSelect(schId, schedule);
          }
        }}
      >
        {schedule.data &&
          schedule.data.map(({ bgColor, id }) => {
            const sch = allClasses[id];

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
            action={async (f) => {
              if (noEdit) return;
              await nameChange(f);
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
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="h-3 w-3 md:h-4 md:w-4"
              />
            </Button>

            <Button
              variant="basic"
              type="button"
              onClick={() => setEditName(false)}
              className="shrink-0 p-1"
            >
              <FontAwesomeIcon
                icon={faXmarkCircle}
                className="h-3 w-3 md:h-4 md:w-4"
              />
            </Button>
          </form>
        ) : (
          <>
            <p
              className={cn(!noEdit && "cursor-pointer", "line-clamp-1")}
              onClick={() => {
                if (noEdit) return;
                setEditName(true);
              }}
              title="edit"
            >
              {schedule.name && schedule.name !== ""
                ? schedule.name
                : "Untitled"}
            </p>
            {noEdit !== true && (
              <Button
                title="delete"
                variant="basic"
                className="shrink-0 p-1"
                onClick={async () => {
                  if (noEdit) return;
                  await deleteSchedule();
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="h-3 w-3 md:h-4 md:w-4"
                />
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ScheduleCard;
