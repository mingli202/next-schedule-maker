import { AnimatePresence } from "framer-motion";
import type { SavedSection } from "@/types/schedule";
import SectionBlock from "./SectionBlock";

type Props = {
  disableRemove?: boolean;
  disableControls?: boolean;
  onRemoveSectionClicked?: (sectionId: string) => void;
  savedSections: SavedSection[];
};

export default function GridView({ savedSections, ...props }: Props) {
  return props.disableControls ? (
    savedSections.map((param) => (
      <SectionBlock key={param.sectionId} {...param} {...props} />
    ))
  ) : (
    // TODO: onRemoveSectionClicked
    <AnimatePresence>
      {savedSections.map((param) => (
        <SectionBlock key={param.sectionId} {...param} {...props} />
      ))}
    </AnimatePresence>
  );
}
