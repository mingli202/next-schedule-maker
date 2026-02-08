"use client";

import { useSearch } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { EditorInViewParams } from "@/routes/editor/route";
import SectionBlock from "./SectionBlock";

type Props = {
  disableRemove?: boolean;
} & {
  disableTime?: boolean;
};

export default function GridView({ disableRemove, disableTime }: Props) {
  const search = useSearch({ strict: false });

  const res = EditorInViewParams.safeParse(search);

  const sectionsInView = res.success ? res.data.sections : [];

  return disableTime ? (
    sectionsInView.map((param) => (
      <SectionBlock
        key={param.sectionId}
        {...param}
        disableRemove={disableRemove}
        disableTime={disableTime}
        onRemoveSectionClicked={() => {}}
      />
    ))
  ) : (
    // TODO: onRemoveSectionClicked
    <AnimatePresence>
      {sectionsInView.map((param) => (
        <SectionBlock
          key={param.sectionId}
          {...param}
          disableRemove={disableRemove}
          disableTime={disableTime}
          onRemoveSectionClicked={() => {}}
        />
      ))}
    </AnimatePresence>
  );
}
