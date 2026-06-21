import { cn } from "src/lib/utils";
import type { Section } from "src/types/generated";
import { Diff, LeclabsDiff } from "./diffs";

type ChangedSectionPreviewCardProps = {
  oldSection: Section;
  newSection: Section;
  className?: string;
};
export function ChangedSectionPreviewCard({
  oldSection,
  newSection,
  className,
}: ChangedSectionPreviewCardProps) {
  return (
    <div
      className={cn(
        "bg-secondary/50 flex flex-col gap-2 rounded-xl p-2",
        className,
      )}
    >
      <div>
        <h2 className="font-light">
          <Diff oldStr={oldSection.course} newStr={newSection.course} />
          {": "}
          <Diff oldStr={oldSection.domain} newStr={newSection.domain} />{" "}
          <Diff oldStr={oldSection.code} newStr={newSection.code} />
        </h2>

        <h1 className="font-heading text-base font-bold md:text-xl">
          <Diff oldStr={oldSection.section} newStr={newSection.section} />{" "}
          <Diff oldStr={oldSection.title} newStr={newSection.title} />
        </h1>
      </div>

      <LeclabsDiff
        oldLeclabs={oldSection.leclabs}
        newLecLabs={newSection.leclabs}
        sectionId={oldSection.id}
      />

      {oldSection.more !== "" || newSection.more !== "" ? (
        <p className="opacity-70">
          <Diff oldStr={oldSection.more} newStr={newSection.more} />
        </p>
      ) : null}
    </div>
  );
}
