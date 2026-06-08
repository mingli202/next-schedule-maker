import { motion, type Variants } from "framer-motion";
import { Minimize } from "lucide-react";
import type { Section } from "src/types/generated";
import { cn } from "@/lib/utils";
import Button from "../Button";
import SectionCard from "../SectionCard";

type ExpandSectionProps = {
  section: Section;
  bgColor: string;
  textColor: string;
  onRemoveSectionClicked: (sectionId: string) => void;
  onMinimizeClicked: () => void;
};

export default function ExpandSection({
  section,
  bgColor,
  textColor,
  onRemoveSectionClicked,
  onMinimizeClicked,
}: ExpandSectionProps) {
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
        className="flex w-4/5 flex-col rounded-2xl p-1 shadow-xl"
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
              onRemoveSectionClicked(section.id);
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
            <Minimize className="h-5" />
          </Button>
        </div>

        <SectionCard
          section={section}
          className={cn("bg-transparent p-1")}
          leclabClassName={cn({
            "bg-black/10": textColor === "#000",
            "bg-white/10": textColor === "#FFF",
          })}
        />
      </motion.div>
    </motion.div>
  );
}
