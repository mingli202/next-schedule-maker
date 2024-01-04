"use client";

import { Class, SharedCurrentClasses } from "@/types";
import { Fragment, useContext, useState } from "react";
import {
  ScheduleClassesContext,
  ScheduleDispatchContext,
} from "../ScheduleContext";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/ui";
import ExpandClass from "./ExpandClass";

type Props = {
  allClasses: Record<string, Class>;
};

type MergedClass = Class & SharedCurrentClasses;

const ClassBlock = ({ cl }: { cl: MergedClass }) => {
  const dispatch = useContext(ScheduleDispatchContext);
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
            className="relative z-10 box-border overflow-hidden rounded-md p-2 text-[8px] leading-[10px] md:text-[14px] md:leading-[14px]"
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
            <div className="absolute left-0 top-0 box-border h-full w-full rounded-md border-[3px] border-solid border-black bg-transparent opacity-20 mix-blend-darken" />
            <p className="line-clamp-2 font-bold">{cl.lecture.title}</p>
            <p className="mt-1 line-clamp-1">{cl.code}</p>
            <p className="font">{cl.section}</p>
            <p className="mt-1 line-clamp-2">{cl.lecture.prof}</p>
            <motion.div
              className="absolute bottom-0 left-0 flex w-full justify-between bg-white/10 p-2 backdrop-blur-sm backdrop-filter"
              variants={card}
              initial={{ opacity: 0 }}
            >
              <Button
                variant="basic"
                className="rounded-none p-0"
                onClick={() => dispatch({ type: "delete", id: cl.id })}
                title="remove"
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button
                variant="basic"
                className="rounded-none p-0"
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
          />
        )}
      </AnimatePresence>
    </Fragment>
  );
};

const GridView = ({ allClasses }: Props) => {
  const currentClasses = useContext(ScheduleClassesContext);
  const fullClasses: MergedClass[] = currentClasses.map((cl) => {
    const toReturn: MergedClass = { ...allClasses[cl.id], ...cl };
    return toReturn;
  });

  return (
    <AnimatePresence>
      {fullClasses.map((cl, index) => (
        <ClassBlock key={cl.code + cl.section + index} cl={cl} />
      ))}
    </AnimatePresence>
  );
};

export default GridView;
