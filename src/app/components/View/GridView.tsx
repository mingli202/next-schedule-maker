"use client";

import { Class, SharedCurrentClasses, StateType } from "@/types";
import { Fragment, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/ui";
import ExpandClass from "./ExpandClass";

type MergedClass = Class & SharedCurrentClasses;

type Props = {
  allClasses: Record<string, Class>;
  disableRemove?: boolean;
} & {
  stateType: StateType;
  scheduleClasses: SharedCurrentClasses[];
};

function GridView({
  allClasses,
  disableRemove,
  scheduleClasses,
  stateType,
}: Props) {
  const fullClasses: MergedClass[] = scheduleClasses.map((cl) => {
    const toReturn: MergedClass = { ...allClasses[cl.id], ...cl };
    return toReturn;
  });

  return (
    <AnimatePresence>
      {fullClasses.map((cl, index) => (
        <ClassBlock
          key={cl.code + cl.section + index}
          cl={cl}
          disableRemove={disableRemove}
          stateType={stateType}
        />
      ))}
    </AnimatePresence>
  );
}

function ClassBlock({
  cl,
  disableRemove,
  stateType,
}: {
  cl: MergedClass;
  disableRemove?: boolean;
  stateType: StateType;
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
            key={cl.code + d + cl.section}
            className="relative z-10 box-border overflow-hidden rounded-md border-[3px] border-solid border-black/20 p-1 text-[8px] leading-[10px] md:text-[14px] md:leading-[14px]"
            style={{
              gridColumn: d,
              gridRowStart: start,
              gridRowEnd: end,
              color: cl.textColor,
              backgroundColor: cl.bgColor,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            variants={card}
            whileHover="hover"
          >
            <p className="line-clamp-2 font-bold">{cl.lecture.title}</p>
            <p className="mt-1 line-clamp-1">{cl.code}</p>
            <p className="font">{cl.section}</p>
            <p className="mt-1 line-clamp-2">{cl.lecture.prof}</p>
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
                    if (disableRemove) return;
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
                  setExpand(true);
                }}
                title="expand"
              >
                <FontAwesomeIcon icon={faExpand} />
              </Button>
            </motion.div>
          </motion.div>
        );
      })}
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
    </Fragment>
  );
}

export default GridView;
