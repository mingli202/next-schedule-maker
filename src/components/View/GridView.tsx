"use client";

import { useSearch } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { EditorInViewParams } from "@/types/schedule";
import SectionBlock from "./SectionBlock";

type Props = {
  disableRemove?: boolean;
  disableControls?: boolean;
};

export default function GridView(props: Props) {
  const search = useSearch({ strict: false });

  const res = EditorInViewParams.safeParse(search);

  const sectionsInView = res.success ? res.data.sections : [];

  return props.disableControls ? (
    sectionsInView.map((param) => (
      <SectionBlock
        key={param.sectionId}
        {...param}
        {...props}
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
          {...props}
          onRemoveSectionClicked={() => {}}
        />
      ))}
    </AnimatePresence>
  );
}
