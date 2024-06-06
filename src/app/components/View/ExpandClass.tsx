"use client";

import { Class, SharedCurrentClasses, StateType } from "@/types";
import { Button } from "@/ui";
import { faClock, faCompress, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variants, motion } from "framer-motion";
import { cn } from "@/lib";

type MergedClass = Class & SharedCurrentClasses;

function ExpandClass({
  cl,
  setExpand,
  stateType,
  disableRemove,
}: {
  cl: MergedClass;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
  stateType: StateType;
  disableRemove?: boolean;
}) {
  const expandVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  const cardVariants: Variants = {
    initial: {
      scale: 0.9,
    },
    animate: {
      scale: 1,
    },
  };

  return (
    <motion.div
      className="absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center rounded-md bg-white/30 text-xs backdrop-blur-md backdrop-filter md:text-base"
      initial="initial"
      animate="animate"
      exit="initial"
      variants={expandVariants}
      onClick={() => {
        setExpand(false);
      }}
    >
      <motion.div
        className="flex w-4/5 flex-col rounded-md p-1 shadow-xl"
        style={{
          backgroundColor: cl.bgColor,
          color: cl.textColor,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        variants={cardVariants}
      >
        <div className="flex w-full items-center justify-between">
          {!disableRemove && stateType !== "none" ? (
            <Button
              variant="basic"
              className="p-1 italic"
              onClick={() => {
                setExpand(false);
                if (stateType.type === "dispatch") {
                  stateType.dispatch({ type: "delete", id: cl.id });
                } else {
                  stateType.dispatch((sch) =>
                    sch.filter((s) => s.id !== cl.id),
                  );
                }
              }}
            >
              Remove Class
            </Button>
          ) : (
            <div className="invisible bg-transparent" />
          )}
          <Button
            variant="basic"
            onClick={() => setExpand(false)}
            className="p-1"
            title="minimize"
          >
            <FontAwesomeIcon icon={faCompress} />
          </Button>
        </div>

        <div className="flex flex-col p-1">
          <h2>
            {cl.program}: {cl.course} {cl.code}
          </h2>

          <h1 className="font-heading text-base font-bold md:text-2xl">
            {cl.section} {cl.lecture.title}
          </h1>

          <div
            className={cn("mt-2 rounded-md p-2", {
              "bg-black/10": cl.textColor === "#000",
              "bg-white/10": cl.textColor === "#FFF",
            })}
          >
            <h4 className="italic">Lecture</h4>

            <div className="relative flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
              {cl.lecture.prof}
              <div className="group relative flex cursor-default font-bold">
                <p>
                  {cl.lecture.rating.score === 0
                    ? "N/A"
                    : cl.lecture.rating.score}
                </p>
                <div
                  className={cn(
                    "absolute top-0 hidden w-[12rem] -translate-x-1/2 translate-y-1/3 md:-translate-y-1/2 md:translate-x-12",
                    "z-10 rounded-md bg-slate p-1 text-sm font-normal leading-4 text-black shadow-lg group-hover:block",
                  )}
                >
                  <p>
                    Rating:{" "}
                    {cl.lecture.rating.avg === 0
                      ? "N/A"
                      : `${cl.lecture.rating.avg}/5`}
                  </p>
                  <p>
                    Difficulty:{" "}
                    {cl.lecture.rating.difficulty === 0
                      ? "N/A"
                      : `${cl.lecture.rating.difficulty}/5`}
                  </p>
                  <p>
                    Raters:{" "}
                    {cl.lecture.rating.nRating === 0
                      ? "N/A"
                      : `${cl.lecture.rating.nRating} raters`}
                  </p>
                  <p>
                    Take again:{" "}
                    {cl.lecture.rating.takeAgain === 0
                      ? "N/A"
                      : `${cl.lecture.rating.takeAgain}%`}
                  </p>
                  <p className="font-bold">
                    Overall Score:{" "}
                    {cl.lecture.rating.score === 0
                      ? "N/A"
                      : `${cl.lecture.rating.score}/100`}
                  </p>
                </div>
              </div>
            </div>

            {Object.entries(cl.lecture)
              .filter((i) => !["title", "prof", "rating"].includes(i[0]))
              .map((j, index) => {
                return (
                  <p className="flex items-center gap-2" key={index}>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="h-4 opacity-50"
                    />
                    {j[0]}
                    <span>{j[1] as string}</span>
                  </p>
                );
              })}
          </div>

          {"prof" in cl.lab && (
            <div
              className={cn("mt-2 rounded-md p-2", {
                "bg-black/10": cl.textColor === "#000",
                "bg-white/10": cl.textColor === "#FFF",
              })}
            >
              <h4 className="italic">Lab</h4>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
                {cl.lab.prof}
                <div className="group relative flex cursor-default font-bold">
                  <p>
                    {cl.lab.rating.score === 0 ? "N/A" : cl.lab.rating.score}
                  </p>
                  <div className="absolute top-0 z-10 hidden w-[12rem] -translate-y-1/2 translate-x-12 rounded-md bg-slate p-1 text-sm font-normal leading-4 text-black shadow-lg group-hover:block">
                    <p>
                      Rating:{" "}
                      {cl.lab.rating.avg === 0
                        ? "N/A"
                        : `${cl.lab.rating.avg}/5`}
                    </p>
                    <p>
                      Difficulty:{" "}
                      {cl.lab.rating.difficulty === 0
                        ? "N/A"
                        : `${cl.lab.rating.difficulty}/5`}
                    </p>
                    <p>
                      Raters:{" "}
                      {cl.lab.rating.nRating === 0
                        ? "N/A"
                        : `${cl.lab.rating.nRating} raters`}
                    </p>
                    <p>
                      Take again:{" "}
                      {cl.lab.rating.takeAgain === 0
                        ? "N/A"
                        : `${cl.lab.rating.takeAgain}%`}
                    </p>
                    <p className="font-bold">
                      Overall Score:{" "}
                      {cl.lab.rating.score === 0
                        ? "N/A"
                        : `${cl.lab.rating.score}/100`}
                    </p>
                  </div>
                </div>
              </div>

              {Object.entries(cl.lab)
                .filter((i) => !["title", "prof", "rating"].includes(i[0]))
                .map((j, index) => {
                  return (
                    <p className="flex items-center gap-2" key={index}>
                      <FontAwesomeIcon
                        icon={faClock}
                        className="h-4 opacity-50"
                      />
                      {j[0]}
                      <span>{j[1] as string}</span>
                    </p>
                  );
                })}
            </div>
          )}

          {cl.more !== "" && <p className="mt-2 opacity-70">{cl.more}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ExpandClass;
