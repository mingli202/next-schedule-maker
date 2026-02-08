"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Fragment, useState } from "react";
import cn from "@/lib/cn";
import Button from "../Button";
import ExpandSection from "./ExpandSection";
import { useSearch } from "@tanstack/react-router";
import { EditorInViewParams } from "@/routes/editor/route";
import { useQuery } from "@tanstack/react-query";
import { getSectionSectionsSectionIdGet } from "@/client";
import { getColorFromIndex } from "@/lib/colors";
import { Section } from "@/types/generated";
import { Maximize, Minus } from "lucide-react";

type Props = {
  disableRemove?: boolean;
} & {
  disableTime?: boolean;
};

function GridView({ disableRemove, disableTime }: Props) {
  const search = useSearch({ strict: false });

  const res = EditorInViewParams.safeParse(search);

  const sectionsInView = res.success ? res.data : [];

  return disableTime ? (
    sectionsInView.map((cl, index) => (
      <SectionBlock
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
        <SectionBlock
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

type SectionBlockProps = {
  sectionId: number;
  colorIndex: number;
  disableRemove?: boolean;
  disableTime?: boolean;
  onRemoveSectionClicked: () => void;
};

function SectionBlock({
  sectionId,
  colorIndex,
  disableRemove,
  disableTime,
  onRemoveSectionClicked,
}: SectionBlockProps) {
  const [expand, setExpand] = useState(false);

  const {
    data: section,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      const res = await getSectionSectionsSectionIdGet({
        path: { section_id: sectionId },
      });

      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }

      return Section.parse(res.data);
    },
    staleTime: Infinity,
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    console.trace(`Section ${sectionId} failed to load. Error ${error}`);
    return null;
  }

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
            initial={disableTime ? undefined : { opacity: 0, scale: 0.9 }}
            animate={disableTime ? undefined : { opacity: 1, scale: 1 }}
            exit={disableTime ? undefined : { opacity: 0, scale: 0.9 }}
            transition={disableTime ? undefined : { delay: index * 0.05 }}
            variants={disableTime ? undefined : card}
            whileHover="hover"
          >
            <p className="line-clamp-2 font-bold">{section.title}</p>
            <p className="mt-1 line-clamp-1">{section.code}</p>
            <p className="font">{section.section}</p>
            <p className="mt-1 line-clamp-2">{section.times[0]?.prof}</p>
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
                    if (disableTime) return;
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
      {disableTime ? null : (
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

export default GridView;
