import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Maximize, Minus } from "lucide-react";
import { Fragment, useState } from "react";
import { useSection } from "@/hooks";
import { getColorFromIndex } from "@/lib/colors";
import { cn } from "@/lib/utils";
import Button from "../Button";
import ExpandSection from "./ExpandSection";

type SectionBlockProps = {
  // section id to show
  sectionId: number;
  // section color
  colorIndex: number;
  // can't remove class from current schedule in view
  disableRemove?: boolean;
  // mini view like in auto generate
  disableControls?: boolean;
  onRemoveSectionClicked: () => void;
};

export default function SectionBlock({
  sectionId,
  colorIndex,
  disableRemove,
  disableControls,
  onRemoveSectionClicked,
}: SectionBlockProps) {
  const [expand, setExpand] = useState(false);

  const { data: section } = useSection(sectionId);

  if (!section) return null;

  const card: Variants = {
    hover: {
      opacity: 1,
    },
  };

  const { textColor, bgColor } = getColorFromIndex(colorIndex);

  return (
    <Fragment key={`${section.code}-${section.section}-fragment`}>
      {section.viewData.map((times, index) => {
        const [d, [start, end]] = Object.entries(times)[0];

        return (
          <motion.div
            key={section.code + d + section.section + index.toString()}
            className={cn(
              "relative z-10 box-border overflow-hidden rounded-md border-[3px]",
              "border-solid border-black/20 p-1",
            )}
            style={{
              gridColumn: d,
              gridRowStart: start,
              gridRowEnd: end,
              color: textColor,
              backgroundColor: bgColor,
            }}
            initial={disableControls ? undefined : { opacity: 0, scale: 0.9 }}
            animate={disableControls ? undefined : { opacity: 1, scale: 1 }}
            exit={disableControls ? undefined : { opacity: 0, scale: 0.9 }}
            transition={disableControls ? undefined : { delay: index * 0.05 }}
            variants={disableControls ? undefined : card}
            whileHover="hover"
          >
            <p className="line-clamp-2 font-bold">{section.title}</p>
            <p className="mt-1 line-clamp-1">{section.code}</p>
            <p className="font">{section.section}</p>
            <p className="mt-1 line-clamp-2">{section.leclabs[0]?.prof}</p>
            {disableControls ? null : (
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
                      if (disableRemove || disableControls) return;
                      onRemoveSectionClicked();
                    }}
                    title="remove"
                  >
                    <Minus />
                  </Button>
                ) : (
                  <div className="basis-full" />
                )}
                <Button
                  variant="basic"
                  className="shrink-0 rounded-none p-0"
                  onClick={() => {
                    if (disableControls) return;
                    setExpand(true);
                  }}
                  title="expand"
                >
                  <Maximize />
                </Button>
              </motion.div>
            )}
          </motion.div>
        );
      })}
      {disableControls ? null : (
        <AnimatePresence>
          {expand && (
            <ExpandSection
              section={section}
              bgColor={bgColor}
              textColor={textColor}
              onMinimizeClicked={() => setExpand(false)}
              onRemoveSectionClicked={onRemoveSectionClicked}
            />
          )}
        </AnimatePresence>
      )}
    </Fragment>
  );
}
