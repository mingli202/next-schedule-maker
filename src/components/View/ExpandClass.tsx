"use client";

import { motion, type Variants } from "framer-motion";
import { Minimize } from "lucide-react";
import cn from "@/lib/cn";
import type { Section } from "@/types/generated";
import Button from "../Button";
import LecLab from "../LecLab";

type ExpandClassProps = {
  section: Section;
  bgColor: string;
  textColor: string;
  onRemoveSectionClicked: () => void;
  onMinimizeClicked: () => void;
};

function ExpandClass({
  section,
  bgColor,
  textColor,
  onRemoveSectionClicked,
  onMinimizeClicked,
}: ExpandClassProps) {
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
      className="absolute top-0 left-0 z-30 flex h-full w-full items-center justify-center rounded-md bg-white/30 text-xs backdrop-blur-md backdrop-filter md:text-base"
      initial="initial"
      animate="animate"
      exit="initial"
      variants={expandVariants}
      onClick={() => {
        onMinimizeClicked();
      }}
    >
      <motion.div
        className="flex w-4/5 flex-col rounded-md p-1 shadow-xl"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        variants={cardVariants}
      >
        <div className="flex w-full items-center justify-between">
          <Button
            variant="basic"
            className="p-1 italic"
            onClick={() => {
              onRemoveSectionClicked();
              onMinimizeClicked();
            }}
          >
            Remove Class
          </Button>
          <Button
            variant="basic"
            onClick={onMinimizeClicked}
            className="p-1"
            title="minimize"
          >
            <Minimize />
          </Button>
        </div>

        <div className="flex flex-col p-1">
          <h2>
            {section.course}: {section.domain} {section.code}
          </h2>

          <h1 className="font-heading text-base font-bold md:text-2xl">
            {section.section} {section.title}
          </h1>

          <LecLab
            section={section}
            className={cn("mt-2 rounded-md p-2", {
              "bg-black/10": textColor === "#000",
              "bg-white/10": textColor === "#FFF",
            })}
          />

          {section.more !== "" && (
            <p className="mt-2 opacity-70">{section.more}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ExpandClass;
