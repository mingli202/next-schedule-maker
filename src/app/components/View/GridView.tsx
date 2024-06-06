"use client";

import { Class, SharedCurrentClasses, StateType } from "@/types";
import { Fragment, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/ui";
import ExpandClass from "./ExpandClass";
import { cn } from "@/lib";

type MergedClass = Class & SharedCurrentClasses;

type Props = {
  allClasses: Record<string, Class>;
  disableRemove?: boolean;
} & {
  stateType: StateType;
  scheduleClasses: SharedCurrentClasses[];
  disableTime?: boolean;
};

function GridView({
  allClasses,
  disableRemove,
  scheduleClasses,
  stateType,
  disableTime,
}: Props) {
  const fullClasses: MergedClass[] = scheduleClasses.map((cl) => {
    const toReturn: MergedClass = { ...allClasses[cl.id], ...cl };
    return toReturn;
  });

  return disableTime ? (
    fullClasses.map((cl, index) => (
      <ClassBlock
        key={cl.code + cl.section + index}
        cl={cl}
        disableRemove={disableRemove}
        stateType={stateType}
        disableTime={disableTime}
      />
    ))
  ) : (
    <AnimatePresence>
      {fullClasses.map((cl, index) => (
        <ClassBlock
          key={cl.code + cl.section + index}
          cl={cl}
          disableRemove={disableRemove}
          stateType={stateType}
          disableTime={disableTime}
        />
      ))}
    </AnimatePresence>
  );
}

function ClassBlock({
  cl,
  disableRemove,
  stateType,
  disableTime,
}: {
  cl: MergedClass;
  disableRemove?: boolean;
  stateType: StateType;
  disableTime?: boolean;
}) {
  const card: Variants = {
    hover: {
      opacity: 1,
    },
  };

  const [expand, setExpand] = useState(false);

  return (
    <Fragment key={cl.code + cl.section + "fragment"}>
      {cl.viewData.map((times, index) => {
        const [d, [start, end]] = Object.entries(times)[0];

        return (
          <motion.div
            key={cl.code + d + cl.section + index}
            className={cn(
              "relative z-10 box-border overflow-hidden rounded-md border-[3px]",
              "border-solid border-black/20 p-1",
            )}
            style={{
              gridColumn: d,
              gridRowStart: start,
              gridRowEnd: end,
              color: cl.textColor,
              backgroundColor: cl.bgColor,
            }}
            initial={disableTime ? undefined : { opacity: 0, scale: 0.9 }}
            animate={disableTime ? undefined : { opacity: 1, scale: 1 }}
            exit={disableTime ? undefined : { opacity: 0, scale: 0.9 }}
            transition={disableTime ? undefined : { delay: index * 0.05 }}
            variants={disableTime ? undefined : card}
            whileHover="hover"
          >
            <p className="line-clamp-2 font-bold">{cl.lecture.title}</p>
            <p className="mt-1 line-clamp-1">{cl.code}</p>
            <p className="font">{cl.section}</p>
            <p className="mt-1 line-clamp-2">{cl.lecture.prof}</p>
            {disableTime ? null : (
              <motion.div
                className="absolute bottom-0 left-0 flex w-full justify-between bg-white/10 p-2 backdrop-blur-sm backdrop-filter"
                variants={card}
                initial={{ opacity: 0 }}
              >
                {!disableRemove ? (
                  <Button
                    variant="basic"
                    className="rounded-none p-0"
                    onClick={() => {
                      if (disableRemove || disableTime) return;
                      if (stateType === "none") return;
                      if (stateType.type == "dispatch") {
                        stateType.dispatch({ type: "delete", id: cl.id });
                      }
                    }}
                    title="remove"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                ) : (
                  <div className="basis-full" />
                )}
                <Button
                  variant="basic"
                  className="shrink-0 rounded-none p-0"
                  onClick={() => {
                    if (disableTime) return;
                    setExpand(true);
                  }}
                  title="expand"
                >
                  <FontAwesomeIcon icon={faExpand} />
                </Button>
              </motion.div>
            )}
          </motion.div>
        );
      })}
      {disableTime ? null : (
        <AnimatePresence key={cl.code + cl.section + "expanded"}>
          {expand && (
            <ExpandClass
              cl={cl}
              setExpand={setExpand}
              key={cl.code + cl.section + "expanded"}
              stateType={stateType}
              disableRemove={disableRemove}
            />
          )}
        </AnimatePresence>
      )}
    </Fragment>
  );
}

export default GridView;
